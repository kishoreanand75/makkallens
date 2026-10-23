import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = { title: "Admin | MakkalLens", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-4xl">Admin review</h1>
      <p className="mb-8 mt-3 text-ink-soft">Outdated-information reports, contact messages, waitlist and AI-pipeline stats. Requires the ADMIN_TOKEN configured on the server.</p>
      <AdminPanel />
    </div>
  );
}
