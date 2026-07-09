import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { bookingId } = req.body;

    const result = await paymentService.createCheckoutSession(
      userId as string,
      bookingId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;

    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook received successfully",
      data: null,
    });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await paymentService.getMyPayments(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id;
    const userId = req.user?.id;

    const result = await paymentService.getPaymentDetails(
      paymentId as string,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getPaymentDetails,
};
