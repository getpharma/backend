import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { isUndefined } from "util";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";
import { Helpers } from "../util/helpers.util";
import { History } from "../models/history.model";

export class HistoryTransformer extends TransformerAbstract<History> {

  defaultIncludes = ["user"];

  async includeUser(history: History): Promise<Dictionary<any>> {
    let user = history.user;
    if (!history.user_id) {
      return null;
    }

    if (isUndefined(user)) {
      user = await history.$get("user") as User;
    }

    return new UserTransformer().transform(user);
  }

  protected _map(history: History): Dictionary<any> {
    return {
      id                  : Helpers.replaceUndefinedWithNull(history.id),
      order_id            : Helpers.replaceUndefinedWithNull(history.order_id),
      user_id             : Helpers.replaceUndefinedWithNull(history.user_id),
      products            : Helpers.replaceUndefinedWithNull(history.products),
      undelivered_products: Helpers.replaceUndefinedWithNull(history.undelivered_products),
      completed_products  : [],
      amount              : Helpers.replaceUndefinedWithNull(history.amount),
      delivery_charge     : Helpers.replaceUndefinedWithNull(history.delivery_charge),
      delivery_address    : Helpers.replaceUndefinedWithNull(history.delivery_address),
      packager_id         : Helpers.replaceUndefinedWithNull(history.packager_id),
      packager            : Helpers.replaceUndefinedWithNull(history.packager),
      delivery_man_id     : Helpers.replaceUndefinedWithNull(history.delivery_man_id),
      delivery_man        : Helpers.replaceUndefinedWithNull(history.delivery_man),
      payment_status      : Helpers.replaceUndefinedWithNull(history.payment_status),
      order_status        : Helpers.replaceUndefinedWithNull(history.order_status),
      delivery_date       : Helpers.replaceUndefinedWithNull(history.delivery_date),
      invoice_url         : Helpers.replaceUndefinedWithNull(history.invoice_url),
      created_at          : Helpers.replaceUndefinedWithNull(history.createdAt),
      updated_at          : Helpers.replaceUndefinedWithNull(history.updatedAt),
      deleted_at          : Helpers.replaceUndefinedWithNull(history.deletedAt)
    };
  }

}
