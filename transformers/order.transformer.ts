import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { isUndefined } from "util";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";
import { Helpers } from "../util/helpers.util";
import { Employee } from "../models/employee.model";
import { EmployeeTransformer } from "./employee.transformer";

export class OrderTransformer extends TransformerAbstract<Order> {

  defaultIncludes = ["user", "packager", "delivery_man"];

  async includeUser(order: Order): Promise<Dictionary<any>> {
    let user = order.user;
    if (!order.user_id) {
      return null;
    }

    if (isUndefined(user)) {
      user = await order.$get("user") as User;
    }

    return new UserTransformer().transform(user);
  }

  async includePackager(order: Order): Promise<Dictionary<any>> {
    let packager = order.packager;
    if (!order.packager_id) {
      return null;
    }
    if (isUndefined(packager)) {
      packager = await order.$get("packager") as Employee;
    }
    return new EmployeeTransformer().transform(packager);
  }

  async includeDeliveryMan(order: Order): Promise<Dictionary<any>> {
    let packager = order.delivery_man;
    if (!order.delivery_man_id) {
      return null;
    }
    if (isUndefined(packager)) {
      packager = await order.$get("delivery_man") as Employee;
    }
    return new EmployeeTransformer().transform(packager);
  }


  protected _map(order: Order): Dictionary<any> {
    return {
      id                : Helpers.replaceUndefinedWithNull(order.id),
      order_id          : Helpers.replaceUndefinedWithNull(order.order_id),
      user_id           : Helpers.replaceUndefinedWithNull(order.user_id),
      cart_id           : Helpers.replaceUndefinedWithNull(order.cart_id),
      products          : Helpers.replaceUndefinedWithNull(order.products),
      amount            : Helpers.replaceUndefinedWithNull(order.amount),
      delivery_charge   : Helpers.replaceUndefinedWithNull(order.delivery_charge),
      delivery_address  : Helpers.replaceUndefinedWithNull(order.delivery_address),
      delivery_man_id   : Helpers.replaceUndefinedWithNull(order.delivery_man_id),
      packager_id       : Helpers.replaceUndefinedWithNull(order.packager_id),
      delivery_code     : Helpers.replaceUndefinedWithNull(order.delivery_code),
      payment_status    : Helpers.replaceUndefinedWithNull(order.payment_status),
      order_status      : Helpers.replaceUndefinedWithNull(order.order_status),
      pending_products  : Helpers.replaceUndefinedWithNull(order.pending_products),
      completed_products: Helpers.replaceUndefinedWithNull(order.completed_products),
      expected_date     : Helpers.replaceUndefinedWithNull(order.expected_date),
      invoice_url       : Helpers.replaceUndefinedWithNull(order.invoice_url),
      latitude          : Helpers.replaceUndefinedWithNull(order.latitude),
      longitude         : Helpers.replaceUndefinedWithNull(order.longitude),
      created_at        : Helpers.replaceUndefinedWithNull(order.createdAt),
      updated_at        : Helpers.replaceUndefinedWithNull(order.updatedAt),
      deleted_at        : Helpers.replaceUndefinedWithNull(order.deletedAt)
    };
  }

}
