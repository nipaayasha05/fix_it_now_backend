import cookieParser from "cookie-parser";
import { Application } from "express";
import express from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { technicianRoutes } from "./modules/technician/technician.routes";
import { categoriesRoutes } from "./modules/category/category.routes";
import { serviceRoutes } from "./modules/service/service.routes";
import { availabilityRoutes } from "./modules/availability/availability.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { reviewRoutes } from "./modules/review/review.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { stripe } from "./lib/stripe";
import { notFound } from "./middlewares/notFound";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

const endpointSecret = config.stripe_webhook_secret;

app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("FixItNow!");
});

// app.use("/uploads", express.static("uploads"));

app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/technician", technicianRoutes);
app.use("/api/admin", categoriesRoutes);

app.use("/api/technician/services", serviceRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/technician/availability", availabilityRoutes);

app.use("/api/bookings", bookingRoutes);
// app.use("/api/technician", bookingRoutes);

app.use("/api/technicians", technicianRoutes);

app.use("/api/admin", userRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/payments", paymentRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
