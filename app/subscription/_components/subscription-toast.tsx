"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const SubscriptionToast = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message === "subscription-required") {
      toast.error(
        "Você precisa assinar o plano premium para acessar esta funcionalidade.",
      );
    }
  }, [message]);

  return null;
};

export default SubscriptionToast;
