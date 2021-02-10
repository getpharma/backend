export interface ProductWholesalerProductCreateDto {
  title: string;
  manufacturer: string;
  mrp: number;
  pack_size: string;
  category_id: number;
  off_percentage?: number;
  off_amount?: number;
  deal_price?: number;
  composition?: string;
}
