import { PaymentStatus } from "../../enums/payment-status.enum";
import { OrderStatus, PickupStatus } from "../../enums/order-status.enum";
import { CompactProduct } from "../../models/compact-product.model";
import { AvailabilityEnum } from "../../enums/availability.enum";

export interface PickupProductUpdateDto {
  employee_id?: number;
  wholesaler_product_id?: number;
  availability?: AvailabilityEnum;
  available_quantity?: number;
  pickup_date?: Date;
  amount?: number;
  new_price?: number;
}
