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
    apiVersion: "2025-02-24.acacia",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      // Atualizar o usuário com o seu novo plano
      const { customer, subscription, subscription_details } =
        event.data.object;
      const clerkUserId = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }

      // Atualizar metadados do Clerk
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });

      // Criar ou atualizar assinatura no banco de dados
      await prisma.subscription.upsert({
        where: {
          userId: clerkUserId,
        },
        create: {
          userId: clerkUserId,
          status: "active",
          stripeSubscriptionId: subscription,
          stripeCustomerId: customer?.toString(),
          plan: "premium",
        },
        update: {
          status: "active",
          stripeSubscriptionId: subscription,
          stripeCustomerId: customer?.toString(),
          plan: "premium",
        },
      });

      break;
    }
    case "customer.subscription.deleted": {
      // Remover plano premium do usuário
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      const clerkUserId = subscription.metadata.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }

      // Atualizar metadados do Clerk
      await clerkClient().users.updateUser(clerkUserId, {
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
          canceledAt: new Date(),
        },
      });
    }
  }
  return NextResponse.json({ received: true });
};
