"use client";

import { ReportItem } from "@/app/types/report";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { FileText, Film, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReportCardProps {
  report: ReportItem;
}

const ReportCard = ({ report }: ReportCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={report.thumbnail}
          alt={report.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {report.premium && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            <Lock className="h-3 w-3" />
            <span>Premium</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 font-semibold text-gray-900">
            {report.title}
          </h3>
          {report.type === "pdf" ? (
            <FileText className="h-5 w-5 flex-shrink-0 text-blue-600" />
          ) : (
            <Film className="h-5 w-5 flex-shrink-0 text-purple-600" />
          )}
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {report.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-1">
          {report.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{report.date}</span>
          <span>{report.time}</span>
        </div>

        {/* Action */}
        <div className="mt-4">
          <Link
            href={
              report.type === "pdf" ? report.url || "#" : `#video-${report.id}`
            }
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full justify-between border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <span>
                {report.type === "pdf" ? "Visualizar PDF" : "Assistir Vídeo"}
              </span>
              {report.type === "pdf" ? (
                <FileText className="h-4 w-4" />
              ) : (
                <Film className="h-4 w-4" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
