import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";
import APPError from "../../middlewares/appError";
import httpStatus from "http-status";

const createCategory = async (payload: ICategory) => {
  const { name } = payload;

  if (!name || name.trim() === "") {
    throw new APPError(httpStatus.BAD_REQUEST, "name is required");
  }

  if (name.trim().length < 3) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "Category name must be at least 3 characters.",
    );
  }

  if (name.trim().length > 50) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "Category name cannot exceed 50 characters.",
    );
  }

  // exist check
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: name.trim(),
    },
  });

  if (existingCategory) {
    throw new APPError(httpStatus.BAD_REQUEST, "Category name already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getAllCategoriesPublic = async () => {
  const result = await prisma.category.findMany({});
  return result;
};

export const categoriesService = {
  createCategory,
  getAllCategories,
  getAllCategoriesPublic,
};
