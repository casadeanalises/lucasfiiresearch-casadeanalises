import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
  console.log('Webhook do Stripe recebido');
  
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Configurações do Stripe ausentes');
      return new NextResponse(
        JSON.stringify({ error: "Configuração do Stripe ausente" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      console.error('Assinatura do webhook ausente');
      return new NextResponse(
        JSON.stringify({ error: "Assinatura do webhook ausente" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verificando assinatura do webhook');
    const text = await request.text();
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Erro ao validar assinatura:', err);
      return new NextResponse(
        JSON.stringify({ error: "Erro na validação do webhook" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("Webhook recebido:", event.type);

    try {
      switch (event.type) {
        case "invoice.paid": {
          console.log("Processando invoice.paid");
          const invoice = event.data.object as Stripe.Invoice;
          
          if (!invoice.subscription) {
            console.log("Invoice sem subscription, ignorando");
            return new NextResponse(
              JSON.stringify({ received: true, message: "Invoice sem subscription" }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          
          console.log("Subscription recuperada:", subscription.id);
          
          let clerkUserId = subscription.metadata?.clerk_user_id;
          const stripeCustomerId =
            typeof invoice.customer === "string"
              ? invoice.customer
              : invoice.customer?.toString();

          console.log("Dados do invoice.paid:", {
            clerkUserId,
            subscription: subscription.id,
            customer: stripeCustomerId,
          });

          if (!clerkUserId) {
            console.log("Tentando obter clerk_user_id do cliente");
            const customer = await stripe.customers.retrieve(stripeCustomerId as string) as Stripe.Customer;
            if (customer.metadata?.clerk_user_id) {
              console.log("clerk_user_id encontrado nos metadados do cliente");
              clerkUserId = customer.metadata.clerk_user_id;
              await stripe.subscriptions.update(subscription.id, {
                metadata: { clerk_user_id: clerkUserId }
              });
            } else {
              console.log("Tentando obter clerk_user_id da sessão mais recente");
              const sessions = await stripe.checkout.sessions.list({
                limit: 1,
                customer: stripeCustomerId,
              });
              
              if (sessions.data[0]?.client_reference_id) {
                clerkUserId = sessions.data[0].client_reference_id;
                console.log("clerk_user_id encontrado na sessão:", clerkUserId);
                await stripe.subscriptions.update(subscription.id, {
                  metadata: { clerk_user_id: clerkUserId }
                });
              } else {
                console.error("clerk_user_id não encontrado em nenhum lugar");
                return new NextResponse(
                  JSON.stringify({ error: "clerk_user_id não encontrado" }),
                  { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
              }
            }
          }

          try {
            // Atualizar metadados do Clerk
            await clerkClient.users.updateUser(clerkUserId, {
              privateMetadata: {
                stripeCustomerId: stripeCustomerId,
                stripeSubscriptionId: subscription.id,
              },
              publicMetadata: {
                subscriptionPlan: "premium",
              },
            });

            // Criar ou atualizar assinatura no banco de dados
            const existingSubscription = await prisma.subscription.findFirst({
              where: { userId: clerkUserId },
            });

            await prisma.subscription.upsert({
              where: {
                id: existingSubscription?.id ?? "",
              },
              create: {
                userId: clerkUserId,
                status: "active",
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomerId,
                planType: "premium",
                price: 0,
              },
              update: {
                status: "active",
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomerId,
                planType: "premium",
              },
            });
          } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            return new NextResponse(
              JSON.stringify({ 
                error: "Erro ao atualizar dados",
                message: error instanceof Error ? error.message : "Erro desconhecido"
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          break;
        }
        case "checkout.session.completed": {
          console.log("Processando checkout.session.completed");
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (!session.subscription) {
            console.log("Sessão sem subscription, ignorando");
            return new NextResponse(
              JSON.stringify({ received: true, message: "Sessão sem subscription" }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          console.log("Subscription recuperada:", subscription.id);
          
          let clerkUserId = session.client_reference_id || subscription.metadata?.clerk_user_id;
          const stripeCustomerId = session.customer?.toString();

          if (!stripeCustomerId) {
            console.error("Customer ID não encontrado");
            return new NextResponse(
              JSON.stringify({ error: "Customer ID não encontrado" }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          console.log("Dados do checkout.session.completed:", {
            clerkUserId,
            subscription: subscription.id,
            customer: stripeCustomerId,
          });

          if (!clerkUserId) {
            console.log("Tentando obter clerk_user_id do cliente");
            const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
            if (customer.metadata?.clerk_user_id) {
              clerkUserId = customer.metadata.clerk_user_id;
            }
          }

          if (!clerkUserId) {
            console.error("clerk_user_id não encontrado");
            return new NextResponse(
              JSON.stringify({ error: "clerk_user_id não encontrado" }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          try {
            // Atualizar subscription com clerk_user_id se necessário
            if (!subscription.metadata?.clerk_user_id) {
              console.log("Atualizando metadata da subscription com clerk_user_id");
              await stripe.subscriptions.update(subscription.id, {
                metadata: { clerk_user_id: clerkUserId }
              });
            }

            // Atualizar metadados do Clerk
            await clerkClient.users.updateUser(clerkUserId, {
              privateMetadata: {
                stripeCustomerId: stripeCustomerId,
                stripeSubscriptionId: subscription.id,
              },
              publicMetadata: {
                subscriptionPlan: "premium",
              },
            });

            // Criar ou atualizar assinatura no banco de dados
            const existingSubscription = await prisma.subscription.findFirst({
              where: { userId: clerkUserId },
            });

            await prisma.subscription.upsert({
              where: {
                id: existingSubscription?.id ?? "",
              },
              create: {
                userId: clerkUserId,
                status: "active",
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomerId,
                planType: "premium",
                price: 0,
              },
              update: {
                status: "active",
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomerId,
                planType: "premium",
              },
            });
          } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            return new NextResponse(
              JSON.stringify({ 
                error: "Erro ao atualizar dados",
                message: error instanceof Error ? error.message : "Erro desconhecido"
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          }

          break;
        }
        case "customer.subscription.deleted": {
          const subscription = await stripe.subscriptions.retrieve(
            event.data.object.id,
          );
          const clerkUserId = subscription.metadata.clerk_user_id;

          console.log("Dados do subscription.deleted:", {
            clerkUserId,
            subscriptionId: subscription.id,
          });

          if (!clerkUserId) {
            console.error("clerk_user_id não encontrado nos metadados");
            return new NextResponse("clerk_user_id não encontrado", { status: 400 });
          }

          // Atualizar metadados do Clerk
          await clerkClient.users.updateUser(clerkUserId, {
            privateMetadata: {
              stripeCustomerId: null,
              stripeSubscriptionId: null,
            },
            publicMetadata: {
              subscriptionPlan: null,
            },
          });

          // Atualizar assinatura no banco de dados
          await prisma.subscription.updateMany({
            where: {
              userId: clerkUserId,
              status: "active",
            },
            data: {
              status: "canceled",
              updatedAt: new Date(),
            },
          });
        }
      }

      return new NextResponse(
        JSON.stringify({ received: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return new NextResponse(
        JSON.stringify({ 
          error: "Erro ao processar webhook",
          message: error instanceof Error ? error.message : "Erro desconhecido"
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Erro geral no webhook:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Erro interno no servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
