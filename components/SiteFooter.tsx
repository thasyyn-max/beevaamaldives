import Link from "next/link";
import { CONTACT } from "@/lib/config";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Your journey to tropical paradise. A local team curating resorts,
            safari boats and guesthouses.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-ink">Explore</div>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/category/resorts" className="hover:text-ink">Resort</Link></li>
            <li><Link href="/category/safari" className="hover:text-ink">Safari</Link></li>
            <li><Link href="/category/guesthouses" className="hover:text-ink">Guesthouse</Link></li>
            <li><Link href="/guide" className="hover:text-ink">Maldives Guide</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-ink">Contact</div>
          <ul className="mt-3 space-y-2 text-muted">
            <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-ink">{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-ink">{CONTACT.email}</a></li>
            <li><a href={`https://wa.me/${CONTACT.whatsapp}`} className="hover:text-ink">WhatsApp us</a></li>
            <li className="max-w-xs leading-relaxed">{CONTACT.address}</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-ink">Follow</div>
          <ul className="mt-3 space-y-2 text-muted">
            <li><a href={CONTACT.facebook} target="_blank" rel="noopener" className="hover:text-ink">Facebook</a></li>
            <li><a href={CONTACT.instagram} target="_blank" rel="noopener" className="hover:text-ink">Instagram</a></li>
            <li><Link href="/admin" className="hover:text-ink">Team login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Beevaa Maldives · Vaadhoo, Gaafu Dhaalu Atoll 🇲🇻
      </div>
    </footer>
  );
}
