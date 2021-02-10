import { DaysEnum } from "../../enums/days.enum";

export interface UserUpdateDto {
  name?: string;
  store_name?: string;
  email?: string;
  mobile_no?: string;
  alternate_no?: string;
  password?: string;
  address?: string;
  permanent_address?: string;
  landmark?: string;
  state?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  delivery_charge?: number;
  delivery_day?: DaysEnum;
  is_active?: boolean;
}
