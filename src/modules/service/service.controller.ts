import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { serviceService } from "./service.service";

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await serviceService.createService(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  },
);

const updateService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const payload = req.body;

    const updateService = await serviceService.updateService(
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service updated successfully",
      data: updateService,
    });
  },
);

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getAllServices();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = {
  createService,
  updateService,
  getAllServices,
};
