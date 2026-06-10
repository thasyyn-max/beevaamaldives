export const SITE_NAME = "Beevaa Maldives";
export const SITE_TAGLINE = "Your gateway to the Maldives";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Real contact details (from beevaamaldives.com). Edit here to update site-wide.
export const CONTACT = {
  phone: "+960 9996268",
  whatsapp: "9609996268", // wa.me format
  email: "inquiry@beevaamaldives.com",
  address: "Keneree Lodge, Vaadhoo, Gaafu Dhaalu Atoll, Republic of Maldives",
  facebook: "https://www.facebook.com/profile.php?id=61563375158281",
  instagram: "https://www.instagram.com/beevaamaldives/",
  tiktok: "https://www.tiktok.com",
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isServiceRoleConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
}
