import { Role, UserStatus } from "../../../prisma/generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  status: UserStatus;
  profileImage?: string | null;
}

export interface UpdateUserPayload {
  status?: UserStatus;
}

export interface UpdateMyInfoPayload {
  name?: string;

  phone?: string;
  profileImage?: string | null;
}
