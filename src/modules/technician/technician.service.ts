import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  TechnicianBookingStatusPayload,
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

const getTechnicianById = async (id: string) => {
  const result = await prisma.technician.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      technician: true,
      bookings: true,
      availabilities: true,
      services: true,
    },
  });
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

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  if (booking.technicianId !== technician.id) {
    throw new Error("You can only update your own bookings");
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

export const technicianService = {
  createTechnician,
  updateTechnicianProfile,
  getTechnicianAllBookings,
  getAllTechnicians,
  getTechnicianById,
  updateStatusBooking,
};
