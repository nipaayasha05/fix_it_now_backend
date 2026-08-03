import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// const uploadDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + path.extname(file.originalname);

//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({ storage });

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

router.get("/overview", auth(Role.ADMIN), userController.getOverview);

router.patch("/users/:id", auth(Role.ADMIN), userController.updateUser);

export const userRoutes = router;
