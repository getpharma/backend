import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";
import { WholesalerProduct } from "../models/wholesaler-product.model";
import { WholesalerProductTransformer } from "./wholesaler-product.transformer";
import { PickupProduct } from "../models/pickup-product.model";
import { Product } from "../models/product.model";
import { ProductTransformer } from "./product.transformer";

export class PickupProductTransformer extends TransformerAbstract<PickupProduct> {

  defaultIncludes = ["wholesalerProduct", "product"];

  async includeWholesalerProduct(pickupProduct: PickupProduct): Promise<Dictionary<any>> {
    let wholesalerProduct = pickupProduct.wholesalerProduct;
    if (pickupProduct.wholesaler_product_id === null) {
      return null;
    }

    if (isUndefined(wholesalerProduct)) {
      wholesalerProduct = await pickupProduct.$get("wholesalerProduct") as WholesalerProduct;
    }

    return new WholesalerProductTransformer().transform(wholesalerProduct);
  }

  async includeProduct(pickupProduct: PickupProduct): Promise<Dictionary<any>> {
    let product = pickupProduct.product;
    if (!pickupProduct.product_id) {
      return null;
    }

    if (isUndefined(product)) {
      product = await pickupProduct.$get("product") as Product;
    }

    return new ProductTransformer().transform(product);
  }

  protected _map(pickupProduct: PickupProduct): Dictionary<any> {
    return {
      id                   : Helpers.replaceUndefinedWithNull(pickupProduct.id),
      wholesaler_product_id: Helpers.replaceUndefinedWithNull(pickupProduct.wholesaler_product_id),
      product_id           : Helpers.replaceUndefinedWithNull(pickupProduct.product_id),
      amount               : Helpers.replaceUndefinedWithNull(pickupProduct.amount),
      required_quantity    : Helpers.replaceUndefinedWithNull(pickupProduct.required_quantity),
      available_quantity   : Helpers.replaceUndefinedWithNull(pickupProduct.available_quantity),
      availability         : Helpers.replaceUndefinedWithNull(pickupProduct.availability),
      delivery_date        : Helpers.replaceUndefinedWithNull(pickupProduct.delivery_date),
      priority             : Helpers.replaceUndefinedWithNull(pickupProduct.priority),
      created_at           : Helpers.replaceUndefinedWithNull(pickupProduct.createdAt),
      updated_at           : Helpers.replaceUndefinedWithNull(pickupProduct.updatedAt),
      deleted_at           : Helpers.replaceUndefinedWithNull(pickupProduct.deletedAt)
    };
  }

}
