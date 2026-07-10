import { Request, Response, NextFunction } from "express";
import { Role } from "../../prisma/generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import APPError from "./appError";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new APPError(
        httpStatus.UNAUTHORIZED,
        "You are not loged in.log in first",
      );
    }

    const verifiedToken = jwtUtils.verifiedToken(
      token,
      config.jwt_access_secret,
    );

    if (!verifiedToken) {
      throw new APPError(httpStatus.UNAUTHORIZED, "Token is not valid");
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new APPError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });

    if (!user) {
      throw new APPError(httpStatus.NOT_FOUND, "User is not found");
    }

    if (user.status === "BANNED") {
      throw new APPError(httpStatus.UNAUTHORIZED, "User acount is banned");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
    // console.log(req.user);
    next();
  });
};
