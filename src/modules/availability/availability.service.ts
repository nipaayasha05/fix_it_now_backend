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

  const isValidTime = (time: string) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  };

  for (const slot of payload.slots) {
    if (!isValidTime(slot.startTime)) {
      throw new Error("Invalid start time");
    }
    if (!isValidTime(slot.endTime)) {
      throw new Error("Invalid end time");
    }
    if (slot.startTime >= slot.endTime) {
      throw new Error("Start time must be before end time");
    }

    const existingSlot = await prisma.availability.findFirst({
      where: {
        technicianId: technician.id,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
    if (existingSlot) {
      throw new Error("Slot already exists");
    }
  }

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
