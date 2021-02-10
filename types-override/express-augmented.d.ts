import { Employee } from "../models/employee.model";
import { User } from "../models/user.model";
import { Wholesaler } from "../models/wholesaler.model";

declare module "express" {
  export interface Request {
    user: User;
    employee: Employee;
    wholesaler: Wholesaler;
  }
}
