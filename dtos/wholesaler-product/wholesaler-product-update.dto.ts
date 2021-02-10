export interface WholesalerProductUpdateDto {
  mrp?: number;
  off_percentage?: number;
  off_amount?: number;
  deal_price?: number;
  previous_price?: number;
  composition?: string;
  is_assigned?: boolean;
}
