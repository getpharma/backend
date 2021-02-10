import { OrderStatus, PickupStatus } from "../../enums/order-status.enum";
import { AvailabilityEnum } from "../../enums/availability.enum";

export interface PickupUpdateDto {
  employee_id?: number;
  wholesaler_product_id?: number;
  pickup_status?: PickupStatus;
  availability?: AvailabilityEnum;
  available_quantity?: number;
  pickup_date?: Date;
}
