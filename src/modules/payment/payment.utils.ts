import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import {
  BookingStatus,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const transactionId = session.payment_intent as string;
  const bookingId = session.metadata?.bookingId as string;

  if (!userId || !bookingId) {
    console.error("Missing metadata", session.id);
    return;
  }

  await prisma.payment.update({
    where: {
      bookingId,
    },
    data: {
      stripeCustomerId,
      transactionId,
      paidAt: new Date(),
      status: PaymentStatus.SUCCESS,
    },
  });
};
