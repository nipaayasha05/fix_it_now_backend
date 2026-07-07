import { prisma } from "../../lib/prisma";
import { IService } from "./service.interface";

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

export const serviceService = {
  createService,
};
