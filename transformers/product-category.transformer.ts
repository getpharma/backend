import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { ProductCategory } from "../models/product-category.model";

export class ProductCategoryTransformer extends TransformerAbstract<ProductCategory> {

  protected _map(category: ProductCategory): Dictionary<any> {
    return {
      id        : category.id,
      title     : category.title,
      is_active : category.is_active,
      image_url : category.image_url,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
      deleted_at: category.deletedAt
    };
  }

}
