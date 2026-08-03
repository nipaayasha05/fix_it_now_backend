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
    const id = req.user?.id;
    const availabilityId = req.params.id;
    const payload = req.body;
    const result = await availabilityService.updateAvailability(
      id as string,
      payload,
      availabilityId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability updated successfully",
      data: result,
    });
  },
);

const getAllAvailabilityByTechnicianId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //  const id = req.params.id;
    const result = await availabilityService.getAllAvailabilityByTechnicianId(
      req.user?.id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All availability retrieved successfully",
      data: result,
    });
  },
);

const getMyAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await availabilityService.getMyAvailability(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My availability retrieved successfully",
      data: result,
    });
  },
);

export const availabilityController = {
  createAvailability,
  updateAvailability,
  getAllAvailabilityByTechnicianId,
  getMyAvailability,
};
