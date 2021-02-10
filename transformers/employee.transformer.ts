import { TransformerAbstract } from "./transformer.abstract";
import { Dictionary } from "async";
import { Employee } from "../models/employee.model";
import { isUndefined } from "util";
import { Helpers } from "../util/helpers.util";

export class EmployeeCompactTransformer extends TransformerAbstract<Employee> {
  protected _map(employee: Employee): Dictionary<any> {
    return {
      id        : Helpers.replaceUndefinedWithNull(employee.id),
      name      : Helpers.replaceUndefinedWithNull(employee.name),
      email     : Helpers.replaceUndefinedWithNull(employee.email),
      mobile_no : Helpers.replaceUndefinedWithNull(employee.mobile_no),
      created_at: Helpers.replaceUndefinedWithNull(employee.createdAt),
      updated_at: Helpers.replaceUndefinedWithNull(employee.updatedAt)
    };
  }
}

export class EmployeeTransformer extends TransformerAbstract<Employee> {

  protected _map(employee: Employee): Dictionary<any> {
    return {
      id            : Helpers.replaceUndefinedWithNull(employee.id),
      name          : Helpers.replaceUndefinedWithNull(employee.name),
      email         : Helpers.replaceUndefinedWithNull(employee.email),
      mobile_no     : Helpers.replaceUndefinedWithNull(employee.mobile_no),
      password      : Helpers.replaceUndefinedWithNull(employee.password),
      aadhaar_no    : Helpers.replaceUndefinedWithNull(employee.aadhaar_no),
      driver_license: Helpers.replaceUndefinedWithNull(employee.driver_license),
      category      : Helpers.replaceUndefinedWithNull(employee.category),
      address       : Helpers.replaceUndefinedWithNull(employee.address),
      pincode       : Helpers.replaceUndefinedWithNull(employee.pincode),
      created_at    : Helpers.replaceUndefinedWithNull(employee.createdAt),
      updated_at    : Helpers.replaceUndefinedWithNull(employee.updatedAt)
    };
  }

}
