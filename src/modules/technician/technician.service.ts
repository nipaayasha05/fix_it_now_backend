import { prisma } from "../../lib/prisma";
import { TechnicianPayload } from "./technician.interface";

const createTechnician = async (payload: TechnicianPayload, userId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.technician.create({
    data: {
      ...payload,
      technicianId: user.id,
    },
  });
  return result;
};

export const technicianService = {
  createTechnician,
};
