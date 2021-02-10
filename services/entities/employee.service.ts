import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import { Employee } from "../../models/employee.model";
import { EmployeeCreateDto } from "../../dtos/employee/employee-create.dto";
import { EmployeeUpdateDto } from "../../dtos/employee/employee-update.dto";
import { EmployeeCategory } from "../../enums/employee-category.enum";
import { Wholesaler } from "../../models/wholesaler.model";

class EmployeeService {
  private readonly LIMIT = 20;

  private constructor() {
    logger.silly("[N-FT] EmployeeService");
  }

  static getInstance(): EmployeeService {
    return new EmployeeService();
  }

  async create(data: EmployeeCreateDto, transaction?: Transaction): Promise<Employee> {
    return Employee.create(data, {transaction});
  }

  async show(employeeId: number, withIncludes?: boolean): Promise<Employee> {
    return Employee.findOne({
      where: {
        id: employeeId
      }
    });
  }

  async showEmployeeByEmail(email: string, withIncludes?: boolean): Promise<Employee> {
    return Employee.findOne({
      where: {
        email: email
      }
    });
  }

  async showEmployeeByMobile(mobile: string, withIncludes?: boolean): Promise<Employee> {
    return Employee.findOne({
      where: {
        mobile_no: mobile
      }
    });
  }


  async update(employee: Employee, data: EmployeeUpdateDto): Promise<Employee> {
    return employee.update(data);
  }

  async delete(employee: Employee): Promise<any> {
    await employee.destroy();
  }
}

export const employeeService = EmployeeService.getInstance();
