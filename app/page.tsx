"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HomePage = dynamic(() => import("./(home)/page"), {
  ssr: true,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
