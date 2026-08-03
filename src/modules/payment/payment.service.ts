import {
  BookingStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import APPError from "../../middlewares/appError";
import { handleCheckoutCompleted } from "./payment.utils";
import httpStatus from "http-status";

const createCheckoutSession = async (userId: string, bookingId: string) => {
  if (!bookingId) {
    throw new APPError(httpStatus.BAD_REQUEST, "Booking ID is required.");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        payments: true,
      },
    });

    let stripeCustomerId = user.payments[0]?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

    if (booking.customerId !== userId) {
      throw new APPError(
        httpStatus.UNAUTHORIZED,
        "Booking  id must match user id.",
      );
    }

    const existingPayment = await tx.payment.findUnique({
      where: {
        bookingId,
      },
    });

    if (existingPayment) {
      throw new APPError(
        httpStatus.BAD_REQUEST,
        "Booking already has a payment.",
      );
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new APPError(
        httpStatus.BAD_REQUEST,
        "Booking status must be set to accepted.",
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Fix It Now",
            },
            unit_amount: Number(booking.totalPrice) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontend_url}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: user.id,
        bookingId,
      },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        customerId: user.id,
        amount: booking.totalPrice,
        stripeCustomerId,
        status: PaymentStatus.PENDING,
      },
    });

    return session.url;
  });
  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  console.log("Payment webhook service called");
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  console.log("webhook received", event.type);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
};

const getMyPayments = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      customerId: userId,
    },
    include: {
      booking: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(result, "result getMyPayments");
  return result;
};

const getPaymentDetails = async (paymentId: string, userId: string) => {
  const result = await prisma.payment.findUnique({
    where: {
      id: paymentId,
      customerId: userId,
    },
    include: {
      booking: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!result) {
    throw new APPError(httpStatus.NOT_FOUND, "Payment not found.");
  }
  return result;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getPaymentDetails,
};
