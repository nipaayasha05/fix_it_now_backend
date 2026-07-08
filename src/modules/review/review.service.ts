import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";
import httpStatus from "http-status";

const createReview = async (customerId: string, payload: IReview) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: payload.bookingId,
    },
  });

  if (booking.customerId !== customerId) {
    throw new Error("Only the customer of the booking can create a review");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("Booking must be completed to create a review");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
  });

  if (existingReview) {
    throw new Error("Customer already left a review for this booking");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
      customerId,
      technicianId: booking.technicianId,
    },
  });

  //   calcultae technician rating
  const reviews = await prisma.review.findMany({
    where: {
      technicianId: booking.technicianId,
    },
    select: {
      rating: true,
    },
  });

  const totalReviews = reviews.length;
  const averageRating = Number(
    (
      reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
      totalReviews
    ).toFixed(1),
  );
  //   update technician rating
  await prisma.technician.update({
    where: {
      id: booking.technicianId,
    },
    data: {
      averageRating,
      totalReviews,
    },
  });

  return result;
};

export const reviewService = {
  createReview,
};
