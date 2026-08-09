import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await reviewService.createReview(
      customerId as string,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  },
);

const getReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await reviewService.getReviews(customerId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result,
    });
  },
);

const getPublicReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getPublicReviews();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Public reviews retrieved successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getReviews,
  getPublicReviews,
};
