import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router();

router.post("/", auth(Role.TECHNICIAN), serviceController.createService);

router.get("/", serviceController.getAllServices);

router.get(
  "/my-service",
  auth(Role.TECHNICIAN),
  serviceController.getMyServices,
);

router.get("/:id", serviceController.getServiceById);

router.patch("/:id", auth(Role.TECHNICIAN), serviceController.updateService);

export const serviceRoutes = router;
