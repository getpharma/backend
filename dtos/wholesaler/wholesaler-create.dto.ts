export interface WholesalerCreateDto {
  name: string;
  store_name?: string;
  email: string;
  mobile_no: string;
  alternate_no?: string;
  password: string;
  address?: string;
  state?: string;
  pincode?: string;
}
