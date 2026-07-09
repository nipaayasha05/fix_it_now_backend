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

// app.post(
//   "/api/payments/confirm",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     let event = request.body;
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]!;
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

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
