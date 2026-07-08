import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.post("/", auth(Role.TECHNICIAN), technicianController.createTechnician);

router.put(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateTechnicianProfile,
);

router.get("/", technicianController.getAllTechnicians);

router.get("/:id", technicianController.technicianById);

router.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getTechnicianAllBookings,
);

router.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateTechnicianOwnBooking,
);

export const technicianRoutes = router;
