import { prisma } from "../../lib/prisma";
import APPError from "../../middlewares/appError";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status";

const createBooking = async (payload: IBooking, customerId: string) => {
  console.log(customerId);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: customerId,
    },
  });

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId,
    },
  });

  const result = await prisma.booking.create({
    data: {
      ...payload,
      customerId,
      totalPrice: service.price,
    },
  });
  return result;
};

const getMyAllBookings = async (customerId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      technician: true,
      service: true,

      availability: true,
    },
  });
  return result;
};

const getBookingById = async (id: string, customerId: string) => {
  const result = await prisma.booking.findUnique({
    where: {
      id,
      customerId: customerId,
    },
    include: {
      service: true,
      technician: true,
      availability: true,
    },
  });
  if (!result) {
    throw new APPError(httpStatus.NOT_FOUND, "Booking not found.");
  }
  return result;
};

// const getTechnicianAllBookings = async (technicianId: string) => {
//   const result = await prisma.booking.findMany({
//     where: {
//       technicianId,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       service: true,
//       technician: true,
//       availability: true,
//     },
//   });
//   return result;
// };

export const bookingService = {
  createBooking,
  getMyAllBookings,
  getBookingById,
  // getTechnicianAllBookings,
};
