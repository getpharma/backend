import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";
import { Pickup } from "../models/pickup.model";
import { Wholesaler } from "../models/wholesaler.model";
import { WholesalerTransformer } from "./wholesaler.transformer";
import { Employee } from "../models/employee.model";
import { EmployeeTransformer } from "./employee.transformer";

export class PickupTransformer extends TransformerAbstract<Pickup> {

  defaultIncludes = ["wholesaler", "employee"];

  async includeWholesaler(pickup: Pickup): Promise<Dictionary<any>> {
    let wholesaler = pickup.wholesaler;
    if (!pickup.wholesaler_id) {
      return null;
    }

    if (isUndefined(wholesaler)) {
      wholesaler = await pickup.$get("wholesaler") as Wholesaler;
    }

    return new WholesalerTransformer().transform(wholesaler);
  }

  async includeEmployee(pickup: Pickup): Promise<Dictionary<any>> {
    let employee = pickup.employee;
    if (!pickup.employee_id) {
      return null;
    }

    if (isUndefined(employee)) {
      employee = await pickup.$get("employee") as Employee;
    }

    return new EmployeeTransformer().transform(employee);
  }

  protected _map(pickup: Pickup): Dictionary<any> {
    return {
      id            : Helpers.replaceUndefinedWithNull(pickup.id),
      pickup_id     : Helpers.replaceUndefinedWithNull(pickup.pickup_id),
      wholesaler_id : Helpers.replaceUndefinedWithNull(pickup.wholesaler_id),
      products      : Helpers.replaceUndefinedWithNull(pickup.products),
      amount        : Helpers.replaceUndefinedWithNull(pickup.amount),
      pickup_status : Helpers.replaceUndefinedWithNull(pickup.pickup_status),
      delivery_code : Helpers.replaceUndefinedWithNull(pickup.delivery_code),
      employee_id   : Helpers.replaceUndefinedWithNull(pickup.employee_id),
      employee_name : Helpers.replaceUndefinedWithNull(pickup.employee_name),
      pickup_address: Helpers.replaceUndefinedWithNull(pickup.pickup_address),
      pickup_date   : Helpers.replaceUndefinedWithNull(pickup.pickup_date),
      latitude      : Helpers.replaceUndefinedWithNull(pickup.latitude),
      longitude     : Helpers.replaceUndefinedWithNull(pickup.longitude),
      created_at    : Helpers.replaceUndefinedWithNull(pickup.createdAt),
      updated_at    : Helpers.replaceUndefinedWithNull(pickup.updatedAt),
      deleted_at    : Helpers.replaceUndefinedWithNull(pickup.deletedAt)
    };
  }

}
