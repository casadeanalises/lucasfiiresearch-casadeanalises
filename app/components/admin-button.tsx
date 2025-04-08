"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica se existe o cookie admin_token
    const hasAdminToken = document.cookie.includes("admin_token=");
    setIsAdmin(hasAdminToken);
  }, []);

  if (!isAdmin) return null;

  return (
    <Link href="/admin">
      <Button variant="outline">Área Admin</Button>
    </Link>
  );
}
