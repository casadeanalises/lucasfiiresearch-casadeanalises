import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/app/_components/ui/button";
import { AdminButton } from "./admin-button";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          LUCAS FII
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <AdminButton />

          <Button variant="outline" asChild>
            <Link href="/reports">Relatórios</Link>
          </Button>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
