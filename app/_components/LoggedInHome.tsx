"use client";

import { LoggedInHomeContent } from "./LoggedInHomeContent";
import { Suspense } from "react";

export function LoggedInHome() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 text-slate-600">Carregando...</span>
        </div>
      }
    >
      <LoggedInHomeContent />
    </Suspense>
  );
}
