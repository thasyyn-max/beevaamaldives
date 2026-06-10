import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { isCloudinaryConfigured } from "@/lib/config";

/**
 * Returns a short-lived signature so the browser can upload photos
 * directly to Cloudinary without exposing the API secret.
 */
export async function POST() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured (see SETUP.md)" },
      { status: 400 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "beevaa";
  // Cloudinary signature: sha1 of alphabetically-sorted params + api secret
  const toSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
}
