import { prisma } from "../../lib/prisma";
import {
  TechnicianPayload,
  TechnicianPayloadUpdate,
} from "./technician.interface";

const createTechnician = async (payload: TechnicianPayload, userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

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

const getAllTechnicians = async () => {
  const technicians = await prisma.technician.findMany({
    include: {
      technician: true,
      bookings: true,
      availabilities: true,
      services: true,
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
  console.log(result, "result getTechnicianAllBookings");
  return result;
};

export const technicianService = {
  createTechnician,
  updateTechnicianProfile,
  getTechnicianAllBookings,
  getAllTechnicians,
};
