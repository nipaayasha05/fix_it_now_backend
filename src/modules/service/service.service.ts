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

//publice route
const getAllServices = async () => {
  const services = await prisma.service.findMany({
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
