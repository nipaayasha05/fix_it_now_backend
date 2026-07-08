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

const getAllTechnicians = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getAllTechnicians();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

const getTechnicianAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user, "req.user");

    const id = req.user?.id;

    const result = await technicianService.getTechnicianAllBookings(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });

    console.log(result, "result getTechnicianAllBookings Controller");
  },
);

const technicianById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      throw new Error("Id is required");
    }

    const result = await technicianService.getTechnicianById(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician retrieved successfully",
      data: result,
    });
  },
);

const updateTechnicianOwnBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;
    const userId = req.params.id as string;

    const result = await technicianService.updateStatusBooking(
      id,
      userId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: result,
    });
  },
);

export const technicianController = {
  createTechnician,
  updateTechnicianProfile,
  getTechnicianAllBookings,
  getAllTechnicians,
  technicianById,
  updateTechnicianOwnBooking,
};
