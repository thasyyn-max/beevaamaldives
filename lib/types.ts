export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export type ContentBlock = {
  title: string;
  description: string;
  image: string;
  beds?: string; // e.g. "1 queen bed" — used for rooms
  sleeps?: string; // e.g. "2" — max guests, used for rooms
};

export type Property = {
  id: string;
  legacy_id?: number;
  slug: string;
  name: string;
  category: string; // category slug
  atoll: string;
  tags: string[];
  description: string;
  short_description: string;
  facilities: string[];
  accommodations: ContentBlock[];
  dining: ContentBlock[];
  gallery: string[];
  cover: string;
  from_price_usd: number | null;
  status: "draft" | "live";
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  body: string;
  images: string[];
};

export type EnquiryStatus = "new" | "replied" | "closed";

export type Enquiry = {
  id: string;
  reference: string;
  property_id: string | null;
  property_name?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  check_in: string | null;
  check_out: string | null;
  guests: number;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

export type PropertyFilters = {
  category?: string;
  q?: string;
  maxPrice?: number;
  sort?: "price" | "name";
};
