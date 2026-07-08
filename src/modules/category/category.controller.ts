import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { categoriesService } from "./category.service";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await categoriesService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

const getAllCategoriesPublic = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.getAllCategoriesPublic();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully for public",
      data: result,
    });
  },
);

export const categoriesController = {
  createCategory,
  getAllCategories,
  getAllCategoriesPublic,
};
