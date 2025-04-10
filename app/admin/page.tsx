import Link from "next/link";
import { FileText, Settings, BarChart3, Home, PlayCircle } from "lucide-react";

export default function AdminDashboard() {
  const adminAreas = [
    {
      title: "Dashboard",
      description: "Visão geral do sistema",
      icon: <Home className="h-8 w-8" />,
      href: "/admin",
      color: "blue",
      isNew: false,
    },
    {
      title: "Relatórios e Análises",
      description: "Gerencie PDFs e vídeos de análises do mercado",
      icon: <FileText className="h-8 w-8" />,
      href: "/admin/reports",
      color: "indigo",
      isNew: false,
    },
    {
      title: "Vídeos da Home",
      description: "Gerencie os vídeos exibidos na página inicial",
      icon: <PlayCircle className="h-8 w-8" />,
      href: "/admin/home-videos",
      color: "purple",
      isNew: false,
    },
    {
      title: "Carteira",
      description: "Área administrativa da carteira (Em breve)",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "#",
      color: "cyan",
      isNew: true,
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema (Em breve)",
      icon: <Settings className="h-8 w-8" />,
      href: "#",
      color: "slate",
      isNew: true,
    },
  ];

  const getGradientClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-600 to-blue-800";
      case "indigo":
        return "from-indigo-600 to-indigo-800";
      case "purple":
        return "from-purple-600 to-purple-800";
      case "cyan":
        return "from-cyan-600 to-cyan-800";
      default:
        return "from-slate-600 to-slate-800";
    }
  };

  const getIconClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600";
      case "indigo":
        return "bg-indigo-50 text-indigo-600";
      case "purple":
        return "bg-purple-50 text-purple-600";
      case "cyan":
        return "bg-cyan-50 text-cyan-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getProgressClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600";
      case "indigo":
        return "from-indigo-500 to-indigo-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "cyan":
        return "from-cyan-500 to-cyan-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Painel Administrativo
              </h1>
              <p className="mt-2 text-blue-100">
                Gerencie todos os aspectos do sistema
              </p>
            </div>
            <div className="hidden rounded-full bg-white/10 p-4 backdrop-blur-sm lg:block">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

      
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminAreas.map((area) => (
            <Link
              key={area.title}
              href={area.href}
              className={`group relative overflow-hidden rounded-xl bg-white p-6 transition-all hover:shadow-xl ${
                area.href === "#"
                  ? "cursor-not-allowed opacity-60"
                  : "hover:scale-[1.02]"
              }`}
            >
      
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-[0.08] ${getGradientClass(
                  area.color
                )}`}
              />

   
              <div className="relative mb-4">
                <div
                  className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
                    area.color === "blue"
                      ? "bg-blue-500"
                      : area.color === "indigo"
                      ? "bg-indigo-500"
                      : area.color === "purple"
                      ? "bg-purple-500"
                      : area.color === "cyan"
                      ? "bg-cyan-500"
                      : "bg-slate-500"
                  }`}
                />
                <div className={`relative inline-flex rounded-xl p-3 ${getIconClass(area.color)}`}>
                  {area.icon}
                </div>
              </div>

       
              <div className="relative">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
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
                <div className="absolute bottom-0 left-0 h-1 w-full">
                  <div
                    className={`h-full w-full transform bg-gradient-to-r opacity-80 ${getProgressClass(
                      area.color
                    )}`}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
