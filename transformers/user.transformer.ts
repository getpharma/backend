import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { User } from "../models/user.model";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";
//
// export class UserCompactTransformer extends TransformerAbstract<User> {
//   protected _map(user: User): Dictionary<any> {
//     return {
//       id        : Helpers.replaceUndefinedWithNull(user.id),
//       name      : Helpers.replaceUndefinedWithNull(user.name),
//       email     : Helpers.replaceUndefinedWithNull(user.email),
//       mobile_no : Helpers.replaceUndefinedWithNull(user.mobile_no),
//       created_at: Helpers.replaceUndefinedWithNull(user.createdAt),
//       updated_at: Helpers.replaceUndefinedWithNull(user.updatedAt)
//     };
//   }
// }

export class UserTransformer extends TransformerAbstract<User> {

  protected _map(user: User): Dictionary<any> {
    return {
      id               : Helpers.replaceUndefinedWithNull(user.id),
      name             : Helpers.replaceUndefinedWithNull(user.name),
      store_name       : Helpers.replaceUndefinedWithNull(user.store_name),
      email            : Helpers.replaceUndefinedWithNull(user.email),
      mobile_no        : Helpers.replaceUndefinedWithNull(user.mobile_no),
      alternate_no     : Helpers.replaceUndefinedWithNull(user.alternate_no),
      password         : Helpers.replaceUndefinedWithNull(user.password),
      address          : Helpers.replaceUndefinedWithNull(user.address),
      permanent_address: Helpers.replaceUndefinedWithNull(user.permanent_address),
      landmark         : Helpers.replaceUndefinedWithNull(user.landmark),
      state            : Helpers.replaceUndefinedWithNull(user.state),
      pincode          : Helpers.replaceUndefinedWithNull(user.pincode),
      delivery_charge  : Helpers.replaceUndefinedWithNull(user.delivery_charge),
      delivery_day     : Helpers.replaceUndefinedWithNull(user.delivery_day),
      latitude         : Helpers.replaceUndefinedWithNull(user.latitude),
      longitude        : Helpers.replaceUndefinedWithNull(user.longitude),
      favorites        : Helpers.replaceUndefinedWithNull(user.favorites),
      is_active        : Helpers.replaceUndefinedWithNull(user.is_active),
      created_at       : Helpers.replaceUndefinedWithNull(user.createdAt),
      updated_at       : Helpers.replaceUndefinedWithNull(user.updatedAt)
    };
  }

}
