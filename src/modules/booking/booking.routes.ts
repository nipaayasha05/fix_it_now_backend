import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);

router.get("/", auth(Role.CUSTOMER), bookingController.getMyAllBookings);

router.get("/:id", auth(Role.CUSTOMER), bookingController.getBookingById);

export const bookingRoutes = router;
