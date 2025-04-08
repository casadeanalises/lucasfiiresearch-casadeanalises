"use client";

import { Button } from "@/app/_components/ui/button";
import { SettingsIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const ManageSubscriptionButton = () => {
  const { user } = useUser();

  if (!user || !user.emailAddresses[0]?.emailAddress) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-800/50"
    >
      <Link
        className="flex items-center text-white"
        href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
      >
        <SettingsIcon className="mr-2 h-5 w-5" />
        Gerenciar Assinatura
      </Link>
    </Button>
  );
};

export default ManageSubscriptionButton;
