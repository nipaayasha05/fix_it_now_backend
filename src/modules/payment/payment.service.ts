import {
  BookingStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSession = async (userId: string, bookingId: string) => {
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
      throw new Error("Booking  id must match user id.");
    }

    const existingPayment = await tx.payment.findUnique({
      where: {
        bookingId,
      },
    });

    if (existingPayment) {
      throw new Error("Booking already has a payment.");
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new Error("Booking status must be set to accepted.");
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
      success_url: `${config.app_url}/api/payments/success=true`,
      cancel_url: `${config.app_url}/api/payments/cancel=true`,
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

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
};
