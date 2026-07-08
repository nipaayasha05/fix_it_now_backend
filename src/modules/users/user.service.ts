import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, role, status, profileImage } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

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
  const users = await prisma.user.findMany({});
  return users;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

export const userService = {
  registerUserIntoDB,
  getAllUsers,
  getMe,
};
