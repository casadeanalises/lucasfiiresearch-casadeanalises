"use client";

import dynamic from "next/dynamic";
import SubNavbar from "../components/SubNavbar";
import { usePathname } from "next/navigation";


const Navbar = dynamic(() => import("./navbar"), {
  ssr: false,
  loading: () => (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      <div className="flex items-center gap-10">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
        <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-6 w-20 animate-pulse rounded-md bg-gray-200"></div>
      </div>
      <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
    </nav>
  ),
});

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminLoginPage) {
    return null;
  }

  return (
    <>
      <Navbar />
      <SubNavbar />
    </>
  );
}
