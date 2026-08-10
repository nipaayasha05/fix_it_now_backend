import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import APPError from "../../middlewares/appError";
import httpStatus from "http-status";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  if (!email) {
    throw new APPError(httpStatus.BAD_REQUEST, "Email is required");
  }

  if (!password) {
    throw new APPError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  if (user.status === "BANNED") {
    throw new APPError(httpStatus.UNAUTHORIZED, "Your account is banned");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new APPError(
      httpStatus.UNAUTHORIZED,
      "Password password is incorrect",
    );
  }

  const jwtPayload = {
    id: user.id,
    // name: user.name,
    email: user.email,

    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expire_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifiedToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken) {
    throw new APPError(httpStatus.UNAUTHORIZED, "Refresh token is invalid");
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new APPError(httpStatus.UNAUTHORIZED, "Your account is banned");
  }

  const jwtPayload = {
    id: user.id,
    // name: user.name,
    email: user.email,

    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expire_in as SignOptions,
  );

  return {
    accessToken,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};
