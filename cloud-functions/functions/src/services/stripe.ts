import Stripe from "stripe";
import { config } from "../config";
import { DateTime } from "luxon";

export type BooqableRental = {
  order: string;
  customerId: string;
  customerEmail?: string;
  firstPayDate: string;
  returnDate?: string;
  amount: number;
  customerName?: string
};

let stripe: Stripe | null = null;

const stripeClient = () => {
  if (stripe) return stripe;

  stripe = new Stripe(config.stripeAPIKey.value(), {
    apiVersion: "2026-01-28.clover",
  });

  return stripe;
};

export async function getBooqablePaymentIntents(
  startDate: DateTime,
  endDate: DateTime,
) {
  const client = stripeClient();
  const intents = [];
  for await (const intent of client.paymentIntents.search({
    query: `-metadata["order_url"]:null AND created>${startDate.toUnixInteger()} AND created<${endDate.toUnixInteger()} AND status:"succeeded"`,
    expand: ["data.customer"]
  })) {
    if (intent.amount_received > 0) intents.push(intent);
  }

  return intents;
}

export async function getStripeCustomers(ids: string[]) {
  const client = stripeClient();
  const customers = [];

  for (const id of ids) {
    const customer = await client.customers.retrieve(id);
    customers.push(customer);
  }

  return customers;
}

export async function getStripeCustomerByEmail(email: string) {
  const client = stripeClient();
  const results = await client.customers.list({
    email,
  });

  if (results.data.length > 0) {
    return results.data[0];
  } else {
    throw new Error("Could not find customer with email " + email);
  }
}

export async function getBooqableRefundsForPaymentIntent(pi: string) {
  const client = stripeClient();
  const refunds = [];
  for await (const refund of client.refunds.list({
    payment_intent: pi,
  })) {
    if (refund.metadata?.["booqable_object"] === "payment_refund")
      refunds.push(refund);
  }

  return refunds;
}

export async function getBooqablePaymentIntentsForCustomer(customerId: string) {
  const client = stripeClient();
  const intents = [];
  for await (const intent of client.paymentIntents.search({
    query: `-metadata["order_url"]:null AND customer:"${customerId}" AND status:"succeeded"`,
    expand: ["data.customer"],
  })) {
    if (intent.amount_received > 0) intents.push(intent);
  }

  return intents;
}

export async function getBooqableSecurityDepositRefunds(
  startDate: DateTime,
  endDate: DateTime,
) {
  const client = stripeClient();
  const refunds = [];
  for await (const refund of client.refunds.list({
    created: {
      gt: startDate.toUnixInteger(),
      lt: endDate.toUnixInteger(),
    },
  })) {
    if (refund.metadata?.["booqable_object"] === "payment_refund")
      refunds.push(refund);
  }

  return refunds;
}

export async function getBooqableRentalsForCustomer(customerId: string) {
  const pis = await getBooqablePaymentIntentsForCustomer(customerId);

  const refundsByPI: Map<string, Stripe.Refund> = new Map();
  for (const pi of pis) {
    const refunds = await getBooqableRefundsForPaymentIntent(pi.id);
    if (refunds.length > 0) {
      refundsByPI.set(pi.id, refunds[0]);
    }
  }

  const pisByOrder = new Map<string, Stripe.PaymentIntent[]>();

  for (const pi of pis) {
    if (!pi.description) continue;
    if (pisByOrder.has(pi.description)) {
      pisByOrder.get(pi.description)?.push(pi);
    } else {
      pisByOrder.set(pi.description, [pi]);
    }
  }

  const rentals = [];
  for (const [order, pis] of pisByOrder.entries()) {
    const orderPI = pis.find((pi) => !refundsByPI.has(pi.id));
    const refundPI = pis.find((pi) => refundsByPI.has(pi.id));
    const refund = refundPI ? refundsByPI.get(refundPI.id)! : null;

    if (!orderPI) continue;

    const customer = pis[0].customer as Stripe.Customer;
    const rental: BooqableRental = {
      order: order,
      amount: orderPI.amount,
      firstPayDate: DateTime.fromSeconds(orderPI.created).toISO()!,
      returnDate: refund
        ? DateTime.fromSeconds(refund.created).toISO()!
        : undefined,
      customerEmail: customer.email ?? undefined,
      customerId: customer.id,
      customerName: customer.name ?? undefined
    };

    rentals.push(rental);
  }

  return rentals;
}

export async function getBooqableRentalsInRange(
  startDate: DateTime,
  endDate: DateTime,
) {
  const pis = await getBooqablePaymentIntents(startDate, endDate);
  const refunds = await getBooqableSecurityDepositRefunds(startDate, endDate);

  const refundsByPI: Map<string, Stripe.Refund> = new Map(
    refunds.map((r) => [r.payment_intent as string, r]),
  );

  const pisByOrder = new Map<string, Stripe.PaymentIntent[]>();

  for (const pi of pis) {
    if (!pi.description) continue;
    if (pisByOrder.has(pi.description)) {
      pisByOrder.get(pi.description)?.push(pi);
    } else {
      pisByOrder.set(pi.description, [pi]);
    }
  }

  const rentals = [];
  for (const [order, pis] of pisByOrder.entries()) {
    const orderPI = pis.find((pi) => !refundsByPI.has(pi.id));
    const refundPI = pis.find((pi) => refundsByPI.has(pi.id));
    const refund = refundPI ? refundsByPI.get(refundPI.id)! : null;

    if (!orderPI) continue;

    const customer = pis[0].customer as Stripe.Customer;
    const rental: BooqableRental = {
      order: order,
      amount: orderPI.amount,
      firstPayDate: DateTime.fromSeconds(orderPI.created).toISO()!,
      returnDate: refund && refund.created > orderPI.created
        ? DateTime.fromSeconds(refund.created).toISO()!
        : undefined,
      customerEmail: customer.email ?? undefined,
      customerId: customer.id,
      customerName: customer.name ?? undefined
    };

    rentals.push(rental);
  }

  return rentals;
}
