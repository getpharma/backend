import { PaymentStatus } from "../../enums/payment-status.enum";
import { OrderStatus } from "../../enums/order-status.enum";
import { CompactProduct } from "../../models/compact-product.model";

export interface HistoryCreateDto {
  order_id: number;
  user_id: number;
  products: CompactProduct[];
  undelivered_products?: CompactProduct[];
  amount: number;
  delivery_charge: number;
  delivery_address: string;
  packager_id?: number;
  delivery_man_id?: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_date?: Date;
  invoice_url?: string;
  packager?: string;
  delivery_man?: string;
}
