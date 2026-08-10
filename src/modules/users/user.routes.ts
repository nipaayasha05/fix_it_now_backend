import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

router.post(
  "/register",
  // upload.single("profileImage"),
  userController.registerUser,
);

router.get("/users", auth(Role.ADMIN), userController.getAllUsers);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  userController.getMe,
);
router.patch(
  "/me/:id",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  userController.updateMyInfo,
);

router.get("/overview", auth(Role.ADMIN), userController.getOverview);

router.patch("/users/:id", auth(Role.ADMIN), userController.updateUser);

export const userRoutes = router;
