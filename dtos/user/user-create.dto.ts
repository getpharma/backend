import { DaysEnum } from "../../enums/days.enum";

export interface UserCreateDto {
  name: string;
  store_name?: string;
  email: string;
  mobile_no: string;
  alternate_no?: string;
  password: string;
  address?: string;
  permanent_address?: string;
  state?: string;
  pincode?: string;
  delivery_charge: number;
  delivery_day: DaysEnum;
}
