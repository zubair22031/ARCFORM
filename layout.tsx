import type { ReactNode } from "react";

export const metadata = {
  title: "ARCFORM Admin",
  description: "Content management for ARCFORM website",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
