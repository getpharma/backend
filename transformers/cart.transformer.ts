import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { Cart } from "../models/cart.model";
import { Helpers } from "../util/helpers.util";

export class CartTransformer extends TransformerAbstract<Cart> {

  protected _map(cart: Cart): Dictionary<any> {
    return {
      id             : Helpers.replaceUndefinedWithNull(cart.id),
      user_id        : Helpers.replaceUndefinedWithNull(cart.user_id),
      products       : Helpers.replaceUndefinedWithNull(cart.products),
      amount         : Helpers.replaceUndefinedWithNull(cart.amount),
      delivery_charge: Helpers.replaceUndefinedWithNull(cart.delivery_charge),
      created_at     : Helpers.replaceUndefinedWithNull(cart.createdAt),
      updated_at     : Helpers.replaceUndefinedWithNull(cart.updatedAt),
      deleted_at     : Helpers.replaceUndefinedWithNull(cart.deletedAt)
    };
  }

}
