export interface CompactProduct {
  product_id: number;
  title: string;
  rate: number;
  mrp: number;
  no_of_units: number;
  pack_size: string;
  manufacturer: string;
  image_url: string;
}

export interface CompactProductWholesaler {
  product_id: number;
  title: string;
  rate: number;
  no_of_units: number;
  amount: number;
  pack_size: string;
  manufacturer: string;
  image_url: string;
}
