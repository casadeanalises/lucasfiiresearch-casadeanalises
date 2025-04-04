import Link from "next/link";
import { FileText, Settings, BarChart3, Home } from "lucide-react";

export default function AdminDashboard() {
  const adminAreas = [
    {
      title: "Dashboard",
      description: "Visão geral do sistema",
      icon: <Home className="h-8 w-8" />,
      href: "/admin",
      color: "gray",
      isNew: false,
    },
    {
      title: "Relatórios e Análises",
      description: "Gerencie PDFs e vídeos de análises do mercado",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/reports",
      color: "blue",
      isNew: false,
    },
    {
      title: "Carteira",
      description: "Área administrativa da carteira (Em breve)",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "#",
      color: "purple",
      isNew: true,
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema (Em breve)",
      icon: <Settings className="h-8 w-8" />,
      href: "#",
      color: "gray",
      isNew: true,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie todos os aspectos do sistema
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminAreas.map((area) => (
          <Link
            key={area.title}
            href={area.href}
            className={`group relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg ${
              area.href === "#"
                ? "cursor-not-allowed opacity-60"
                : "hover:border-blue-500"
            }`}
          >
            <div className="mb-4">
              <div
                className={`inline-flex rounded-lg p-3 ring-4 ring-opacity-30 ${
                  area.color === "blue"
                    ? "bg-blue-50 text-blue-600 ring-blue-500"
                    : area.color === "purple"
                      ? "bg-purple-50 text-purple-600 ring-purple-500"
                      : "bg-gray-50 text-gray-600 ring-gray-500"
                }`}
              >
                {area.icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {area.title}
                {area.isNew && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    Em breve
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{area.description}</p>
            </div>
            {!area.isNew && (
              <div
                className={`absolute bottom-0 left-0 h-1 w-full transform bg-gradient-to-r ${
                  area.color === "blue"
                    ? "from-blue-400 to-blue-600"
                    : area.color === "purple"
                      ? "from-purple-400 to-purple-600"
                      : "from-gray-400 to-gray-600"
                }`}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
