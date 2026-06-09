"use client";

import { ReactNode } from "react";
import SunflowerField from "./SunflowerField";

interface LayoutProps {
  id?: string;
  className?: string;
  children: ReactNode;
  withSunflowers?: boolean;
  sunflowerCount?: number;
}

export default function Layout({
  id,
  className = "",
  children,
  withSunflowers,
  sunflowerCount = 8,
}: LayoutProps) {
  return (
    <section id={id} className={`py-20 px-4 relative overflow-hidden ${className}`}>
      {children}
      {withSunflowers && <SunflowerField count={sunflowerCount} />}
    </section>
  );
}
