import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { paymentController } from "./payment.controller";
const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.post("/confirm", paymentController.handleWebhook);

export const paymentRoutes = router;
