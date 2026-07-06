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
