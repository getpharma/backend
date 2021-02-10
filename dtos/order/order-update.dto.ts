import { PaymentStatus } from "../../enums/payment-status.enum";
import { OrderStatus } from "../../enums/order-status.enum";
import { CompactProduct } from "../../models/compact-product.model";

export interface OrderUpdateDto {
  packager_id?: number;
  delivery_man_id?: number;
  payment_status?: PaymentStatus;
  order_status?: OrderStatus;
  delivery_code?: string;
  invoice_url?: string;
  pending_products?: CompactProduct[];
}
