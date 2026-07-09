import { Prisma } from "../../../prisma/generated/prisma/client";
import { ServiceWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IService, IServiceUpdate } from "./service.interface";

const createService = async (payload: IService, id: string) => {
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
}

//publice route
const getAllServices = async (query: IServiceQuery) => {
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
        // {
        //   description: {
        //     contains: query.searchTerm,
        //     mode: "insensitive",
        //   },
        // },
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

  const services = await prisma.service.findMany({
    where: {
      AND: andConditions,
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
};
