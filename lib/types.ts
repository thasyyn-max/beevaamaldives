export type Photo = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
};

export type Island = {
  id: string;
  slug: string;
  name: string;
  atoll: string;
  description: string;
  hero_url: string;
  transfer_info: string;
};

export type Room = {
  id: string;
  guesthouse_id: string;
  name: string;
  description: string;
  max_guests: number;
  beds: string;
  base_price_usd: number;
  amenities: string[];
  photos: Photo[];
};

export type Guesthouse = {
  id: string;
  slug: string;
  name: string;
  island_id: string;
  island?: Island;
  description: string;
  amenities: string[];
  rating: number;
  review_count: number;
  contact_email: string;
  contact_phone: string;
  status: "draft" | "live";
  photos: Photo[];
  rooms: Room[];
  min_price_usd?: number;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

export type Booking = {
  id: string;
  reference: string;
  room_id: string;
  room_name?: string;
  guesthouse_name?: string;
  island_name?: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  check_in: string; // YYYY-MM-DD
  check_out: string;
  guests: number;
  nights: number;
  total_usd: number;
  message: string;
  status: BookingStatus;
  created_at: string;
};

export type SearchFilters = {
  island?: string; // island slug
  guests?: number;
  maxPrice?: number;
  q?: string;
  sort?: "price" | "rating";
};

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T00:00:00Z").getTime();
  const b = new Date(checkOut + "T00:00:00Z").getTime();
  return Math.max(0, Math.round((b - a) / 86400000));
}
