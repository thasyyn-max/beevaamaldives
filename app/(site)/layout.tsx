import { MobileNav } from "@/components/MobileNav";
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
      {/* bottom padding clears the floating mobile nav */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileNav />
      <WhatsappButton />
    </>
  );
}
