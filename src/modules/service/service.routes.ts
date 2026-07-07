import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router();

router.post("/", auth(Role.TECHNICIAN), serviceController.createService);

router.patch("/:id", auth(Role.TECHNICIAN), serviceController.updateService);

export const serviceRoutes = router;
