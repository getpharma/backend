import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { Product } from "../models/product.model";
import { Helpers } from "../util/helpers.util";
import { Order } from "../models/order.model";
import { isUndefined } from "util";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";
import { ProductCategory } from "../models/product-category.model";
import { ProductCategoryTransformer } from "./product-category.transformer";


export class ProductTransformer extends TransformerAbstract<Product> {
  defaultIncludes = ["category"];

  async includeCategory(product: Product): Promise<Dictionary<any>> {
    let category = product.category;
    if (!product.category_id) {
      return null;
    }

    if (isUndefined(category)) {
      category = await product.$get("category") as ProductCategory;
    }

    return new ProductCategoryTransformer().transform(category);
  }

  protected _map(product: Product): Dictionary<any> {

    return {
      id            : product.id,
      title         : product.title,
      image_url     : product.image_url,
      manufacturer  : product.manufacturer,
      pack_size     : product.pack_size,
      composition   : Helpers.replaceUndefinedWithNull(product.composition),
      category_id   : product.category_id,
      mrp           : product.mrp,
      off_percentage: Helpers.replaceUndefinedWithNull(product.off_percentage),
      off_amount    : Helpers.replaceUndefinedWithNull(product.off_amount),
      selling_price : Helpers.replaceUndefinedWithNull(product.selling_price),
      is_trending   : product.is_trending,
      is_active     : product.is_active,
      description   : Helpers.replaceUndefinedWithNull(product.description),
      created_at    : product.createdAt,
      updated_at    : product.updatedAt,
      deleted_at    : product.deletedAt
    };
  }
}
