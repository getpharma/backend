import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { Wholesaler } from "../models/wholesaler.model";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";


export class WholesalerTransformer extends TransformerAbstract<Wholesaler> {

  protected _map(wholesaler: Wholesaler): Dictionary<any> {
    return {
      id            : Helpers.replaceUndefinedWithNull(wholesaler.id),
      name          : Helpers.replaceUndefinedWithNull(wholesaler.name),
      store_name    : Helpers.replaceUndefinedWithNull(wholesaler.store_name),
      email         : Helpers.replaceUndefinedWithNull(wholesaler.email),
      mobile_no     : Helpers.replaceUndefinedWithNull(wholesaler.mobile_no),
      alternate_no  : Helpers.replaceUndefinedWithNull(wholesaler.alternate_no),
      password      : Helpers.replaceUndefinedWithNull(wholesaler.password),
      address       : Helpers.replaceUndefinedWithNull(wholesaler.address),
      landmark      : Helpers.replaceUndefinedWithNull(wholesaler.landmark),
      state         : Helpers.replaceUndefinedWithNull(wholesaler.state),
      pincode       : Helpers.replaceUndefinedWithNull(wholesaler.pincode),
      pending_amount: Helpers.replaceUndefinedWithNull(wholesaler.pending_amount),
      latitude      : Helpers.replaceUndefinedWithNull(wholesaler.latitude),
      longitude     : Helpers.replaceUndefinedWithNull(wholesaler.longitude),
      is_active     : Helpers.replaceUndefinedWithNull(wholesaler.is_active),
      created_at    : Helpers.replaceUndefinedWithNull(wholesaler.createdAt),
      updated_at    : Helpers.replaceUndefinedWithNull(wholesaler.updatedAt)
    };
  }

}
