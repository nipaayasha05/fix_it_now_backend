import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  userController.getMe,
);

export const userRoutes = router;
