import {
  AutoIncrement, BelongsTo, BelongsToMany,
  Column,
  DataType, Default, ForeignKey, HasMany, HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique
} from "sequelize-typescript";
import { genSaltSync, hashSync } from "bcrypt";
import { Helpers } from "../util/helpers.util";
import { EmployeeCategory } from "../enums/employee-category.enum";
import { User } from "./user.model";

@Table({
  timestamps: true,
  paranoid  : true,
  tableName : "employees"
})
export class Employee extends Model<Employee> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @Unique
  @Column(DataType.STRING)
  mobile_no: string;

  @Column({
    type: DataType.STRING,
    set : function (this: Employee, value: string) {
      this.setDataValue("password", hashSync(value, genSaltSync(2)));
    }
  })
  password: string;

  @Column(DataType.ENUM({values: Helpers.iterateEnum<EmployeeCategory>(EmployeeCategory)}))
  category: EmployeeCategory;

  @Unique
  @Column(DataType.STRING)
  aadhaar_no?: string;

  @Unique
  @Column(DataType.STRING)
  driver_license?: string;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.STRING)
  pincode: string;

}
