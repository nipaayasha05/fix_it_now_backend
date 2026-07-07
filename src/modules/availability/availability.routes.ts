import { Router } from "express";
import { availabilityController } from "./availability.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.TECHNICIAN),
  availabilityController.createAvailability,
);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  availabilityController.updateAvailability,
);

export const availabilityRoutes = router;
