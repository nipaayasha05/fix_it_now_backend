import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { categoriesController } from "./category.controller";

const router = Router();

router.post(
  "/categories",
  auth(Role.ADMIN),
  categoriesController.createCategory,
);

router.get("/categories", categoriesController.getAllCategories);

export const categoriesRoutes = router;
