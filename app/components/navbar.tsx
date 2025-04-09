import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/app/_components/ui/button";
import AdminButton from "./admin-button";

export default function Navbar() {
  const { user } = useUser();

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

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">
                {user.emailAddresses[0].emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
