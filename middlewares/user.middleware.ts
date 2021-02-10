import { NextFunction, Request, Response } from "express";
import { userService } from "../services/entities/user.service";
import { Helpers } from "../util/helpers.util";
import * as jwt from "jsonwebtoken";
import { InvalidJwtTokenException } from "../exceptions/invalid-jwt-token.exception";
import { InternalException } from "../exceptions/root/internal.exception";
import { ApiErrorCode } from "../exceptions/root/http.exception";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.headers.authorization;
  if (!jwtToken) {
    return Helpers.handleError(res, new InvalidJwtTokenException());
  }
  try {
    const payload = jwt.decode(jwtToken) as any;
    const user    = await userService.show(payload.user.id as number);

    if (!user) {
      return Helpers.handleError(res, new InvalidJwtTokenException());
    }

    req.user = user;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return Helpers.handleError(res, new InvalidJwtTokenException());
    } else {
      return Helpers.handleError(res, new InternalException(e.message, ApiErrorCode.UNKNOWN, e.stack));
    }
  }
  next();
};
