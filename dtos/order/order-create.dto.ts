export interface OrderCreateDto {
  cart_id: number;
  amount: number;
  latitude?: string;
  longitude?: string;
}
