import { axiosClient } from "@/lib/utils";

export type SquarespaceOrder = {
  id: string;
  orderNumber: string;
  createdOn: string;
  modifiedOn: string;
  channel: string;
  fulfillmentStatus: string;
  customerEmail?: string;
  customerId?: string;
  lineItems: {
    id: string;
    variantId: string;
    sku: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPricePaid: {
      value: string;
      currency: string;
    };
    variantOptions: [
      {
        optionName: string;
        value: string;
      },
    ];
    imageUrl: string;
    lineItemType: string;
  }[];
  subtotal: {
    value: string;
    currency: string;
  };
  shippingTotal: {
    value: string;
    currency: string;
  };
  discountTotal: {
    value: string;
    currency: string;
  };
  taxTotal: {
    value: string;
    currency: string;
  };
  refundedTotal: {
    value: string;
    currency: string;
  };
  grandTotal: {
    value: string;
    currency: string;
  };
  channelName: string;
  externalOrderReference: string;
  fulfilledOn: string;
  priceTaxInterpretation: string;
};

type SquarespaceProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isCustomer: boolean;
  createdOn: string;
  transactionSummary: {
    firstOrderSubmittedOn: string;
    lastOrderSubmittedOn: string;
    orderCount: number;
  };
};

export type SquarespaceOrderWithProfile = SquarespaceOrder & {
  customerProfile: SquarespaceProfile | null;
};

export async function getAllSquarespaceOrdersInRange(
  startDate?: string,
  endDate?: string,
): Promise<SquarespaceOrder[]> {
  try {
    const axios = await axiosClient();
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const url = `/squarespace/orders${queryString ? `?${queryString}` : ""}`;

    const resp = await axios.get<SquarespaceOrder[]>(url);

    return resp.data;
  } catch (error) {
    console.error("Error fetching Squarespace orders:", error);
    throw error;
  }
}

export async function getSquarespaceCustomerByEmail(email: string) {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceProfile>(
    `/squarespace/profile?email=${email}`,
  );

  return resp.data;
}

export async function getAllSquarespaceOrdersForClientByEmail(email: string) {
  const profile = await getSquarespaceCustomerByEmail(email).catch(() => null);
  if (!profile) return [];
  return await getAllSquarespaceOrdersForClientById(profile.id);
}

export async function getAllSquarespaceOrdersForClientById(id: string) {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceOrder[]>(
    `/squarespace/orders/customer/${id}`,
  );

  return resp.data;
}

export async function getAllSquarespaceOrdersInRangeWithProfiles(
  startDate?: string,
  endDate?: string,
) {
  const orders = await getAllSquarespaceOrdersInRange(startDate, endDate);

  const emails = Array.from(
    new Set(orders.map((order) => order.customerEmail).filter(Boolean)),
  ) as string[];

  const profiles = await Promise.all(
    emails.map((email) =>
      getSquarespaceCustomerByEmail(email).catch(() => null),
    ),
  );
  const profileByEmail = new Map(
    profiles.filter(Boolean).map((p) => [p.email, p]),
  );

  return orders.map((order) => ({
    ...order,
    customerProfile: order.customerEmail
      ? (profileByEmail.get(order.customerEmail) ?? null)
      : null,
  }));
}
