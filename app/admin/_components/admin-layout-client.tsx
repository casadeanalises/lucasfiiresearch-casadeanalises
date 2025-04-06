"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, BarChart3, Settings, PlayCircle } from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: <FileText className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Vídeos da Home",
    href: "/admin/home-videos",
    icon: <PlayCircle className="h-5 w-5" />,
    isNew: false,
  },
  {
    title: "Carteira",
    href: "#",
    icon: <BarChart3 className="h-5 w-5" />,
    isNew: true,
  },
  {
    title: "Configurações",
    href: "#",
    icon: <Settings className="h-5 w-5" />,
    isNew: true,
  },
];

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Área Administrativa
          </h1>
        </div>
      </div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-xl font-bold text-blue-800">Painel Admin</h1>
          </div>
          <nav className="mt-6 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-3 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    item.isNew
                      ? "cursor-not-allowed opacity-60"
                      : isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={(e) => {
                    if (item.isNew) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </div>
                  {item.isNew && (
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      Em breve
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
