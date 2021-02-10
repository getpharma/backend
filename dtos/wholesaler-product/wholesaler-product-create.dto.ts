export interface WholesalerProductCreateDto {
  mrp?: number;
  off_percentage?: number;
  off_amount?: number;
  deal_price?: number;
  composition?: string;
  product_id: number;
  wholesaler_id: number;
  is_assigned?: boolean;
}
