import listingsJson from "@/lib/hosamane/data/listings.json";
import localitiesJson from "@/lib/hosamane/data/localities.json";
import anchorsJson from "@/lib/hosamane/data/anchors.json";
import type { Anchor, Listing, Locality } from "./types";

export const listings = listingsJson as Listing[];
export const localities = localitiesJson as Locality[];
export const anchors = anchorsJson as Anchor[];

export const listingById = (id: string) => listings.find((l) => l.id === id) ?? null;
export const localityById = (id: string) => localities.find((l) => l.id === id)!;
export const anchorById = (id: string) => anchors.find((a) => a.id === id) ?? null;

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/** ₹1.40 Cr / ₹48.5 lakh / ₹42,000 */
export const inrShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 1 : 2).replace(/\.0+$/, "")} lakh`;
  return inr(n);
};
