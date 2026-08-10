import { Prisma } from "../../../prisma/generated/prisma/client";
import {
  ServiceOrderByWithRelationInput,
  ServiceWhereInput,
} from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import APPError from "../../middlewares/appError";
import { IService, IServiceUpdate } from "./service.interface";
import httpStatus from "http-status-codes";

const createService = async (payload: IService, id: string) => {
  const { title, price, duration, categoryId } = payload;

  // title
  if (!title || !title.trim()) {
    throw new APPError(httpStatus.BAD_REQUEST, "Title is required");
  }

  // price
  if (price === undefined || price === null) {
    throw new APPError(httpStatus.BAD_REQUEST, "Price is required");
  }

  if (!Number.isInteger(price) || price <= 0) {
    throw new APPError(
      httpStatus.BAD_REQUEST,
      "Price must be a positive integer",
    );
  }

  // duration
  if (duration !== undefined) {
    if (!Number.isInteger(duration) || duration <= 0) {
      throw new APPError(
        httpStatus.BAD_REQUEST,
        "Duration must be a positive integer",
      );
    }
  }

  // categoryId
  if (!categoryId) {
    throw new APPError(httpStatus.BAD_REQUEST, "Category ID is required");
  }

  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: id,
    },
  });
  const result = await prisma.service.create({
    data: {
      ...payload,
      technicianId: technician.id,
    },
  });
  return result;
};

const updateService = async (id: string, payload: IServiceUpdate) => {
  const { title, price, duration } = payload;

  // title
  if (!title || !title.trim()) {
    throw new APPError(httpStatus.BAD_REQUEST, "Title is required");
  }

  // price
  if (price !== undefined) {
    if (!Number.isInteger(price) || price <= 0) {
      throw new APPError(
        httpStatus.BAD_REQUEST,
        "Price must be a positive integer",
      );
    }
  }

  // duration
  if (duration !== undefined) {
    if (!Number.isInteger(duration) || duration <= 0) {
      throw new APPError(
        httpStatus.BAD_REQUEST,
        "Duration must be a positive integer",
      );
    }
  }

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.service.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

interface IServiceQuery {
  searchTerm?: string;
  title?: string;

  category?: string;

  price?: string;

  minPrice?: string;

  maxPrice?: string;

  averageRating?: string;

  location?: string;
  page?: string;
  limit?: string;

  sortBy?: "price" | "rating";
  sortOrder?: "asc" | "desc";
}

//publice route
const getAllServices = async (
  query: IServiceQuery,
  page: number,
  limit: number,
) => {
  const andConditions: ServiceWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          technician: {
            location: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: {
        contains: query.title,
        mode: "insensitive",
      },
    });
  }

  if (query.category) {
    andConditions.push({
      category: {
        name: {
          contains: query.category,
          mode: "insensitive",
        },
      },
    });
  }

  if (query.price) {
    andConditions.push({
      price: {
        equals: Number(query.price),
      },
    });
  }

  if (query.minPrice) {
    andConditions.push({
      price: {
        gte: Number(query.minPrice),
      },
    });
  }

  if (query.maxPrice) {
    andConditions.push({
      price: {
        lte: Number(query.maxPrice),
      },
    });
  }

  if (query.location) {
    andConditions.push({
      technician: {
        location: {
          contains: query.location,
          mode: "insensitive",
        },
      },
    });
  }

  if (query.averageRating) {
    andConditions.push({
      technician: {
        averageRating: {
          gte: Number(query.averageRating),
        },
      },
    });
  }

  // Sorting
  let orderBy: ServiceOrderByWithRelationInput | undefined;

  if (query.sortBy === "price") {
    orderBy = {
      price: query.sortOrder === "asc" ? "asc" : "desc",
    };
  }

  if (query.sortBy === "rating") {
    orderBy = {
      technician: {
        averageRating: query.sortOrder === "asc" ? "asc" : "desc",
      },
    };
  }

  // Pagination
  const skip = (page - 1) * limit;

  const whereCondition = {
    AND: andConditions,
  };

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where: whereCondition,
      orderBy,
      skip,
      take: limit,

      include: {
        technician: true,
        category: true,
        bookings: true,
      },
    }),

    prisma.service.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: services,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      technician: {
        include: {
          technician: true,
        },
      },
      category: true,
    },
  });
  if (!service) {
    throw new APPError(httpStatus.NOT_FOUND, "Service not found.");
  }
  return service;
};

const getMyServices = async (userId: string) => {
  const result = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: userId,
    },
  });
  const services = await prisma.service.findMany({
    where: {
      technicianId: result.id,
    },
    include: {
      technician: true,
      category: true,
    },
  });
  return services;
};

export const serviceService = {
  createService,
  updateService,
  getAllServices,
  getServiceById,
  getMyServices,
};
