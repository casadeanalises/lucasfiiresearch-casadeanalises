import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  try {
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Webhook recebido:", event.type);

    switch (event.type) {
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string,
        );
        const clerkUserId = subscription.metadata.clerk_user_id;
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
          console.error("clerk_user_id não encontrado");
          return NextResponse.error();
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

        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        const clerkUserId = session.client_reference_id;

        console.log("Dados do checkout.session.completed:", {
          clerkUserId,
          subscription: subscription.id,
          customer: session.customer,
        });

        if (!clerkUserId) {
          console.error("clerk_user_id não encontrado");
          return NextResponse.error();
        }

        // Atualizar metadados do Clerk
        await clerkClient.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: session.customer,
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
            stripeCustomerId: session.customer?.toString(),
            planType: "premium",
            price: 0,
          },
          update: {
            status: "active",
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: session.customer?.toString(),
            planType: "premium",
          },
        });

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
          return NextResponse.error();
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.error();
  }
};
