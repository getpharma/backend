import { NextFunction, Request, Response } from "express";
import { Helpers } from "../util/helpers.util";
import * as jwt from "jsonwebtoken";
import { InvalidJwtTokenException } from "../exceptions/invalid-jwt-token.exception";
import { InternalException } from "../exceptions/root/internal.exception";
import { ApiErrorCode } from "../exceptions/root/http.exception";
import { employeeService } from "../services/entities/employee.service";

export const employeeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.headers.authorization;
  if (!jwtToken) {
    return Helpers.handleError(res, new InvalidJwtTokenException());
  }
  try {
    const payload  = jwt.decode(jwtToken) as any;
    const employee = await employeeService.show(payload.employee.id as number);

    if (!employee) {
      return Helpers.handleError(res, new InvalidJwtTokenException());
    }

    req.employee = employee;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return Helpers.handleError(res, new InvalidJwtTokenException());
    } else {
      return Helpers.handleError(res, new InternalException(e.message, ApiErrorCode.UNKNOWN, e.stack));
    }
  }
  next();
};
