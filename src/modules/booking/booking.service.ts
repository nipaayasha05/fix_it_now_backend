import { prisma } from "../../lib/prisma";
import { IBooking } from "./booking.interface";

const createService = async (payload: IBooking, customerId: string) => {
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
      service: true,

      availability: true,
    },
  });
  return result;
};

const getBookingById = async (id: string, customerId: string) => {
  const result = await prisma.booking.findUniqueOrThrow({
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
  return result;
};

export const bookingService = {
  createService,
  getMyAllBookings,
  getBookingById,
};
