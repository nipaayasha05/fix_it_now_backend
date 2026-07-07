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

  await prisma.availability.createMany({
    data: payload.slots.map((slot) => ({
      ...slot,
      technicianId: technician.id,
    })),
  });

  const result = await prisma.availability.findMany({
    where: {
      technicianId: technician.id,
    },
  });

  return result;
};

const updateAvailability = async (
  id: string,
  payload: AvailabilityPayloadUpdate,
  availabilityId: string,
) => {
  const technician = await prisma.technician.findUniqueOrThrow({
    where: {
      technicianId: id,
    },
  });

  const availability = await prisma.availability.findUniqueOrThrow({
    where: {
      id: availabilityId,
    },
  });

  if (availability.technicianId !== technician.id) {
    throw new Error("Not Authorized");
  }

  const result = await prisma.availability.update({
    where: {
      id: availabilityId,
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
