import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";
import { WholesalerProduct } from "../models/wholesaler-product.model";
import { Wholesaler } from "../models/wholesaler.model";
import { WholesalerTransformer } from "./wholesaler.transformer";
import { Product } from "../models/product.model";
import { ProductTransformer } from "./product.transformer";


export class WholesalerProductTransformer extends TransformerAbstract<WholesalerProduct> {

  defaultIncludes = ["wholesaler", "product"];

  async includeWholesaler(wholesalerProduct: WholesalerProduct): Promise<Dictionary<any>> {
    let wholesaler = wholesalerProduct.wholesaler;
    if (!wholesalerProduct.wholesaler_id) {
      return null;
    }

    if (isUndefined(wholesaler)) {
      wholesaler = await wholesalerProduct.$get("wholesaler") as Wholesaler;
    }

    return new WholesalerTransformer().transform(wholesaler);
  }

  async includeProduct(wholesalerProduct: WholesalerProduct): Promise<Dictionary<any>> {
    let product = wholesalerProduct.product;
    if (!wholesalerProduct.product_id) {
      return null;
    }

    if (isUndefined(product)) {
      product = await wholesalerProduct.$get("product") as Product;
    }

    return new ProductTransformer().transform(product);
  }


  protected _map(wholesalerProduct: WholesalerProduct): Dictionary<any> {
    return {
      id            : Helpers.replaceUndefinedWithNull(wholesalerProduct.id),
      wholesaler_id : Helpers.replaceUndefinedWithNull(wholesalerProduct.wholesaler_id),
      product_id    : Helpers.replaceUndefinedWithNull(wholesalerProduct.product_id),
      product_name  : Helpers.replaceUndefinedWithNull(wholesalerProduct.product_name),
      mrp           : Helpers.replaceUndefinedWithNull(wholesalerProduct.mrp),
      off_percentage: Helpers.replaceUndefinedWithNull(wholesalerProduct.off_percentage),
      off_amount    : Helpers.replaceUndefinedWithNull(wholesalerProduct.off_amount),
      deal_price    : Helpers.replaceUndefinedWithNull(wholesalerProduct.deal_price),
      previous_price: Helpers.replaceUndefinedWithNull(wholesalerProduct.previous_price),
      composition   : Helpers.replaceUndefinedWithNull(wholesalerProduct.composition),
      is_assigned   : Helpers.replaceUndefinedWithNull(wholesalerProduct.is_assigned),
      created_at    : Helpers.replaceUndefinedWithNull(wholesalerProduct.createdAt),
      updated_at    : Helpers.replaceUndefinedWithNull(wholesalerProduct.updatedAt)
    };
  }

}
