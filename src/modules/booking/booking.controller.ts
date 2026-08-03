import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId, date, time } = req.body;

    // console.log(req.user);

    const id = req.user?.id;
    const payload = req.body;

    const result = await bookingService.createBooking(payload, id as string);

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

const getBookingById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user?.id;

    const result = await bookingService.getBookingById(
      id as string,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const id = req.user?.id;
    const result = await bookingService.getAllBookings();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "AllBookings retrieved successfully",
      data: result,
    });
  },
);

export const getReviewableBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await bookingService.getReviewableBookings(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "ReviewableBookings retrieved successfully",
      data: result,
    });
  },
);

export const bookingController = {
  createBooking,
  getMyAllBookings,
  getBookingById,
  // getTechnicianAllBookings,
  getAllBookings,
  getReviewableBookings,
};
