import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata = { title: "Admin" };

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Admin panel not connected yet
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The public site is running on the imported Beevaa Maldives content.
          To enable the admin panel (manage enquiries, properties and photos),
          connect a free Supabase project:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Create a project at{" "}
            <a
              href="https://supabase.com"
              className="font-semibold text-teal-700 underline"
            >
              supabase.com
            </a>{" "}
            (free tier)
          </li>
          <li>
            Run <code className="rounded bg-slate-100 px-1">supabase/schema.sql</code>{" "}
            in the SQL Editor
          </li>
          <li>
            Add the Supabase keys to{" "}
            <code className="rounded bg-slate-100 px-1">.env.local</code> (see{" "}
            <code className="rounded bg-slate-100 px-1">.env.example</code>)
          </li>
          <li>Restart the dev server / redeploy</li>
        </ol>
        <p className="mt-4 text-sm text-slate-600">
          Full instructions are in <b>SETUP.md</b> in the project root.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          ← Back to the site
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
