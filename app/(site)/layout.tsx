import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsappButton } from "@/components/WhatsappButton";

// Public pages re-render at most every 5 minutes, so content edited in
// the admin panel appears without a redeploy.
export const revalidate = 300;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsappButton />
    </>
  );
}
