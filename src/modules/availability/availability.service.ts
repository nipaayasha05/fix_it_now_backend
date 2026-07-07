import { prisma } from "../../lib/prisma";
import {
  AvailabilityPayload,
  AvailabilityPayloadUpdate,
} from "./availability.interface";

const createAvailability = async (payload: AvailabilityPayload, id: string) => {
  console.log(id);
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: id,
    },
  });

  const result = await prisma.availability.create({
    data: {
      ...payload,
      technicianId: technician.id,
    },
  });
  return result;
};

const updateAvailability = async (
  id: string,
  payload: AvailabilityPayloadUpdate,
) => {
  const availability = await prisma.availability.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.availability.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

export const availabilityService = {
  createAvailability,
  updateAvailability,
};
