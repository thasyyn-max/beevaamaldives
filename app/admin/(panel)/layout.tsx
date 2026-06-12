import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/enquiries", label: "Bookings" },
    { href: "/admin/hero", label: "Hero" },
    { href: "/admin/properties", label: "Properties" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link href="/" className="font-display text-lg font-semibold text-brand">
              beevaa
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted hover:bg-surface hover:text-ink"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={signOut}>
            <button className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-surface">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
