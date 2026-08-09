import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import {
  TechnicianOrderByWithRelationInput,
  TechnicianWhereInput,
} from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import APPError from "../../middlewares/appError";
import {
  TechnicianBookingStatusPayload,
  TechnicianPayload,
  TechnicianPayloadUpdate,
} from "./technician.interface";
import httpStatus from "http-status";

const createTechnician = async (payload: TechnicianPayload, userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!payload.bio) {
    throw new APPError(httpStatus.BAD_REQUEST, "Bio is required");
  }

  if (payload.experience === undefined) {
    throw new APPError(httpStatus.BAD_REQUEST, "Experience is required");
  }

  if (!payload.location) {
    throw new APPError(httpStatus.BAD_REQUEST, "Location is required");
  }

  if (!payload.skills || payload.skills.length === 0) {
    throw new APPError(httpStatus.BAD_REQUEST, "Skills is required");
  }

  // if (!payload.status) {
  //   throw new APPError(httpStatus.BAD_REQUEST, "Status is required.");
  // }

  const result = await prisma.technician.create({
    data: {
      ...payload,
      technicianId: user.id,
    },
    include: {
      technician: true,
    },
  });
  return result;
};

const updateTechnicianProfile = async (
  userId: string,
  payload: TechnicianPayloadUpdate,
) => {
  const { bio, experience, location, skills, status } = payload;

  if (!payload.bio) {
    throw new APPError(httpStatus.BAD_REQUEST, "Bio is required");
  }

  if (payload.experience === undefined) {
    throw new APPError(httpStatus.BAD_REQUEST, "Experience is required");
  }

  if (!payload.location) {
    throw new APPError(httpStatus.BAD_REQUEST, "Location is required");
  }

  if (!payload.skills || payload.skills.length === 0) {
    throw new APPError(httpStatus.BAD_REQUEST, "Skills is required");
  }

  if (!payload.status) {
    throw new APPError(httpStatus.BAD_REQUEST, "Status is required.");
  }

  const updateTechnicianProfile = await prisma.technician.update({
    where: {
      technicianId: userId,
    },
    data: {
      bio,
      experience,
      location,
      skills,
      status,
    },
  });
  return updateTechnicianProfile;
};

interface ITechnicianQuery {
  searchTerm?: string;
  title?: string;

  category?: string;

  price?: string;

  minPrice?: string;

  maxPrice?: string;

  averageRating?: string;
  status?: BookingStatus;

  location?: string;
  page?: string;
  limit?: string;
  sortBy?: "experience" | "rating";
  sortOrder?: "asc" | "desc";
}

const getAllTechnicians = async (query: ITechnicianQuery) => {
  const andConditions: TechnicianWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          technician: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          services: {
            some: {
              category: {
                name: {
                  contains: query.searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }
  if (query.averageRating) {
    andConditions.push({
      averageRating: {
        gte: Number(query.averageRating),
      },
    });
  }

  if (query.price) {
    andConditions.push({
      services: {
        some: {
          price: {
            equals: Number(query.price),
          },
        },
      },
    });
  }

  if (query.minPrice) {
    andConditions.push({
      services: {
        some: {
          price: {
            gte: Number(query.minPrice),
          },
        },
      },
    });
  }

  if (query.maxPrice) {
    andConditions.push({
      services: {
        some: {
          price: {
            lte: Number(query.maxPrice),
          },
        },
      },
    });
  }

  if (query.category) {
    andConditions.push({
      services: {
        some: {
          category: {
            name: {
              contains: query.category,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  // sorting
  let orderBy: TechnicianOrderByWithRelationInput | undefined;

  if (query.sortBy === "experience") {
    orderBy = {
      experience: query.sortOrder === "asc" ? "asc" : "desc",
    };
  }

  if (query.sortBy === "rating") {
    orderBy = {
      averageRating: query.sortOrder === "asc" ? "asc" : "desc",
    };
  }

  const technicians = await prisma.technician.findMany({
    where: {
      AND: andConditions,
    },
    orderBy,
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      bookings: true,
      availabilities: true,
      services: true,
      reviews: true,
    },
  });
  return technicians;
};

const getTechnicianAllBookings = async (id: string) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: id,
    },
  });

  const result = await prisma.booking.findMany({
    where: {
      technicianId: technician.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      service: true,
      technician: true,
      availability: true,
    },
  });
  // console.log(result, "result getTechnicianAllBookings");
  return result;
};

const getTechnicianById = async (id: string) => {
  const result = await prisma.technician.findUnique({
    where: {
      id,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      bookings: true,
      availabilities: {
        where: {
          isAvailable: true,
          booking: {
            none: {},
          },
        },
      },
      services: true,
      reviews: true,
    },
  });
  if (!result) {
    throw new APPError(httpStatus.NOT_FOUND, "Technician not found.");
  }
  return result;
};

const updateStatusBooking = async (
  technicianId: string,
  bookingId: string,
  payload: TechnicianBookingStatusPayload,
) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId,
    },
  });

  const { status } = payload;

  const validStatus = Object.values(BookingStatus);
  if (!validStatus.includes(status as BookingStatus)) {
    throw new APPError(httpStatus.BAD_REQUEST, "Status is invalid.");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  if (booking.technicianId !== technician.id) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "You can only update your own bookings",
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status as BookingStatus,
    },
  });

  return result;
};

const getDashboard = async (userId: string) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: userId,
    },
  });

  if (!technician) {
    throw new APPError(httpStatus.NOT_FOUND, "Technician not found.");
  }

  const technicianId = technician.id;

  const upcomingJobs = await prisma.booking.findMany({
    where: {
      technicianId,
      status: {
        in: ["ACCEPTED", "IN_PROGRESS"],
      },
      createdAt: {
        gte: new Date(),
      },
    },
  });

  const pedingRequests = await prisma.booking.count({
    where: {
      technicianId,
      status: "PENDING",
    },
  });

  const completedRequests = await prisma.booking.count({
    where: {
      technicianId,
      status: "COMPLETED",
    },
  });

  const earnings = await prisma.payment.aggregate({
    where: {
      status: "SUCCESS",
      booking: {
        technicianId,
      },
    },
    _sum: {
      amount: true,
    },
  });
  return {
    upcomingJobs,
    pedingRequests,
    completedRequests,
    totalEarnings: earnings._sum.amount || 0,
  };
};

export const technicianService = {
  createTechnician,
  updateTechnicianProfile,
  getTechnicianAllBookings,
  getAllTechnicians,
  getTechnicianById,
  updateStatusBooking,
  getDashboard,
};
