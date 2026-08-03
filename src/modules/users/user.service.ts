import bcrypt from "bcryptjs";
import { RegisterUserPayload, UpdateUserPayload } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import APPError from "../../middlewares/appError";
import httpStatus from "http-status";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, role, status, profileImage } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new APPError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  if (!name) {
    throw new APPError(httpStatus.BAD_REQUEST, "Name is required");
  }

  if (!email) {
    throw new APPError(httpStatus.BAD_REQUEST, "Email is required");
  }

  if (!password) {
    throw new APPError(httpStatus.BAD_REQUEST, "Password is required");
  }

  if (!phone) {
    throw new APPError(httpStatus.BAD_REQUEST, "Phone number is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new APPError(httpStatus.BAD_REQUEST, "Invalid email address");
  }

  if (password.length < 6) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters",
    );
  }

  // if (!status) {
  //   throw new APPError(httpStatus.BAD_REQUEST, "Status is required");
  // }

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      status,
      profileImage,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
  return users;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      technician: true,
    },
  });
  console.log(user);
  if (!user) {
    throw new APPError(httpStatus.NOT_FOUND, "User not found.");
  }
  return user;
};

const updateUser = async (userId: string, payload: UpdateUserPayload) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const { status } = payload;

  const validStatus = ["ACTIVE", "BANNED"];

  if (!status) {
    throw new APPError(httpStatus.BAD_REQUEST, "Status is required");
  }

  if (!validStatus.includes(status)) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "Invalid status. Please choose from ACTIVE or BANNED",
    );
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
  return result;
};

const getOverview = async () => {
  const totalUsers = await prisma.user.count();

  const activeBookings = await prisma.booking.count({
    where: {
      status: {
        in: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
      },
    },
  });

  const revenue = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: "ACCEPTED",
    },
  });
  return {
    totalUsers,
    activeBookings,
    totalRevenue: revenue._sum.totalPrice || 0,
  };
};

export const userService = {
  registerUserIntoDB,
  getAllUsers,
  getMe,
  updateUser,
  getOverview,
};
