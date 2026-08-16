export const SHOP_PRODUCT_TYPE_LABELS = {
  "made-to-order": "Made to order",
  "one-of-one": "One of one",
} as const;

export type ShopProductType = keyof typeof SHOP_PRODUCT_TYPE_LABELS;

export type ShopProductAvailability = "available" | "sold";

export interface ShopProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * The presentation model used by the Breezy's storefront.
 *
 * Square-specific identifiers and option structures stay out of this model until
 * the catalog integration boundary is designed. A later adapter can translate
 * confirmed commerce data into this shape for the Astro components.
 */
export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  productType: ShopProductType;
  images: [ShopProductImage, ...ShopProductImage[]];
  priceLabel: string;
  availability: ShopProductAvailability;
}

// Real products belong here only after Bre confirms their details. Keeping this
// empty prevents development examples from being mistaken for live inventory.
export const shopProducts: ShopProduct[] = [];
