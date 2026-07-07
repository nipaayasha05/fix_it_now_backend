import { Day } from "../../../prisma/generated/prisma/enums";

export interface AvailabilityPayload {
  slots: AvailabilitySlot[];
}

export interface AvailabilitySlot {
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
