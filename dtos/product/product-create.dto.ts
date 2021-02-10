import { ImageUploadType } from "../../enums/image-upload-type.enum";

export interface ProductCreateDto {
  title: string;
  manufacturer: string;
  pack_size: string;
  category_id: number;
  mrp: number;
  off_percentage?: number;
  off_amount?: number;
  selling_price?: number;
  type?: ImageUploadType;
  composition?: string;
  description?: string;
  is_trending?: boolean;
  is_active?: boolean;
}

export interface BulkCreateDto {
  title: string;
  manufacturer: string;
  pack_size: string;
  category_id: number;
  image_url: string;
  mrp: number;
  off_percentage: number;
  off_amount: number;
  selling_price: number;
  composition: string;
  description?: string;
}
