import { Day } from "../../../prisma/generated/prisma/enums";

export interface AvailabilityPayload {
  technicianId: string;
  day: Day;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailabilityPayloadUpdate {
  day?: Day;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}
