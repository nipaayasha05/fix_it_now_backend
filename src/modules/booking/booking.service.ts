import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import { BookingWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import APPError from "../../middlewares/appError";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status";

interface IBookingQuery {
  searchTerm?: string;
  status?: BookingStatus;
  page?: string;
  limit?: string;
}

const createBooking = async (payload: IBooking, customerId: string) => {
  const { technicianId, serviceId, availabilityId, note } = payload;

  //  technicianId,
  if (!technicianId) {
    throw new APPError(httpStatus.BAD_REQUEST, "Technician id is required");
  }
  //  serviceId,
  if (!serviceId) {
    throw new APPError(httpStatus.BAD_REQUEST, "Service id is required");
  }
  //  availabilityId,
  if (!availabilityId) {
    throw new APPError(httpStatus.BAD_REQUEST, "Availability id is required");
  }

  // console.log(customerId);

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

const getMyAllBookings = async (
  customerId: string,
  query: IBookingQuery = {},
  page: number,
  limit: number,
) => {
  const andConditions: BookingWhereInput[] = [];

  // filtering
  if (query.status) {
    andConditions.push({
      status: query.status,
      // mode: "insensitive",
    });
  }

  const skip = (page - 1) * limit;

  andConditions.push({
    customerId,
    payment: null,
  });

  const whereCondition = {
    AND: andConditions,
  };

  const [result, total] = await Promise.all([
    prisma.booking.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        technician: true,
        service: true,
        availability: true,
      },
    }),
    prisma.booking.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // const result = await prisma.booking.findMany({
  //   where: {
  //     customerId,
  //     // status: "ACCEPTED",
  //     payment: null,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     technician: true,
  //     service: true,
  //     availability: true,
  //   },
  // });
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
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

const getAllBookings = async (
  query: IBookingQuery = {},
  page: number,
  limit: number,
) => {
  const andConditions: BookingWhereInput[] = [];

  // filtering
  if (query.status) {
    andConditions.push({
      status: query.status,
      // mode: "insensitive",
    });
  }

  // pagination

  const skip = (page - 1) * limit;

  const whereCondition = {
    AND: andConditions,
  };

  const [result, total] = await Promise.all([
    prisma.booking.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        technician: {
          include: {
            technician: true,
          },
        },
        service: true,
        availability: true,
        customer: true,
      },
    }),
    prisma.booking.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // const result = await prisma.booking.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     technician: true,
  //     service: true,
  //     availability: true,
  //     customer: true,
  //   },
  // });
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getReviewableBookings = async (customerId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId,
      status: "COMPLETED",
      // payment: {
      //   paymentStatus: "PAID",
      // },
    },
    include: {
      service: true,
      technician: {
        include: {
          technician: true,
        },
      },
      payment: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(JSON.stringify(result, null, 2));
  return result;
};

export const bookingService = {
  createBooking,
  getMyAllBookings,
  getBookingById,
  // getTechnicianAllBookings,
  getAllBookings,
  getReviewableBookings,
};
