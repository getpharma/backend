import { QueryInterface, SequelizeStatic } from "sequelize";
import { dbService } from "../services/db.service";
import { Employee } from "../models/employee.model";

dbService; // Initialising Sequelize...


const employees: any[] = [
  {
    name     : "Admin",
    email    : "admin@getpharma.com",
    mobile_no: "8126555585",
    password : "@dmin@123",
    category : "admin",
    address  : "GetPharma",
    pincode  : "201009"
  },
  {
    name     : "Subhanshu",
    email    : "subhanshu.chaddha2@gmail.com",
    mobile_no: "9711635385",
    password : "Subhanshu2@",
    category : "admin",
    address  : "J-2/106 B DDA Flats",
    pincode  : "110019"
  },
  {
    name     : "Shivam",
    email    : "shivam@gmail.com",
    mobile_no: "9718529289",
    password : "Subhanshu2@",
    category : "admin",
    address  : "A-543 Double Story, Kalkaji",
    pincode  : "110019"
  }
  // {
  //   first_name  : "Path Light Pro",
  //   last_name   : "Manager",
  //   email       : "random1@gmail.com",
  //   password    : "secret",
  //   image_url   : "https://i.pravatar.cc/300",
  //   comment     : null,
  //   phone_number: null,
  //   status      : Status.ACTIVE,
  //   manager_id  : null,
  //   role_id     : 1,
  // },
  // {
  //   first_name  : "Path Light Pro",
  //   last_name   : "Consultant",
  //   email       : "random2@gmail.com",
  //   password    : "secret",
  //   image_url   : "https://i.pravatar.cc/300",
  //   comment     : null,
  //   phone_number: null,
  //   status      : Status.ACTIVE,
  //   manager_id  : null,
  //   role_id     : 1,
  // }
];

export = {
  /**
   * Write code here to seed data.
   *
   * @param queryInterface
   * @param Sequelize
   */
  up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Employee.bulkCreate(employees);
  },

  /**
   * Write code here for drop seed data.
   *
   * @param queryInterface
   * @param Sequelize
   */
  down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Employee.truncate();
  }
};
