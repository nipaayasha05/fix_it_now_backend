import {
  BookingStatus,
  TechnicianStatus,
} from "../../../prisma/generated/prisma/enums";

export interface TechnicianPayload {
  bio?: string;
  experience: number;

  location: string;
  skills: string[];
  status: TechnicianStatus;
  // averageRating: number;
  // totalReviews: number;
}

export interface TechnicianPayloadUpdate {
  bio: string;
  experience: number;
  hourlyRate: number;
  location: string;
  skills: string[];
  status: TechnicianStatus;
  // averageRating?: number;
  // totalReviews?: number;
}

export interface TechnicianBookingStatusPayload {
  status?: BookingStatus;
}
