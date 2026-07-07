import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);

    const id = req.user?.id;
    const payload = req.body;

    const result = await bookingService.createService(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created",
      data: result,
    });
  },
);

const getMyAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await bookingService.getMyAllBookings(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

export const bookingController = {
  createBooking,
  getMyAllBookings,
};
