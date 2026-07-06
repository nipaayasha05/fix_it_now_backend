import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";

const createTechnician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createTechnician(
      payload,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Technician created successfully",
      data: result,
    });
  },
);

const updateTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updateTechnicianProfile =
      await technicianService.updateTechnicianProfile(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile updated successfully",
      data: updateTechnicianProfile,
    });
  },
);

export const technicianController = {
  createTechnician,
  updateTechnicianProfile,
};
