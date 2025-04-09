"use client";

import { HomeClient } from "./HomeClient";
import { LoggedInHome } from "./LoggedInHome";

interface HomeWrapperProps {
  isAuthenticated: boolean;
}

export function HomeWrapper({ isAuthenticated }: HomeWrapperProps) {
  if (!isAuthenticated) {
    return <HomeClient />;
  }

  return <LoggedInHome />;
}
