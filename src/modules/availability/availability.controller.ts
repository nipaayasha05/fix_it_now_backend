import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { availabilityService } from "./availability.service";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";

const createAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await availabilityService.createAvailability(
      payload,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Availability created successfully",
      data: result,
    });
  },
);

const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await availabilityService.updateAvailability(
      id as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability updated successfully",
      data: result,
    });
  },
);

export const availabilityController = {
  createAvailability,
  updateAvailability,
};
