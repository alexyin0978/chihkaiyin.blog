"use client";

import { ThemeProvider as Provider } from "next-themes";
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Provider attribute="class">{children}</Provider>;
}
