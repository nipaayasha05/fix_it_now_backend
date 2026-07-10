import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { error } from "node:console";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(err);

  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    errorDetails: err.errorDetails || null,
    path: req.originalUrl,
  });
};
