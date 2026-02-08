import { axiosClient } from "@/lib/utils"

export type SquarespaceOrder = {
  id: string,
  orderNumber: string,
  createdOn: string,
  modifiedOn: string,
  channel: string,
  fulfillmentStatus: string,
  customerEmail?: string,
  customerId?: string,
  lineItems: {
    id: string,
    variantId: string,
    sku: string,
    productId: string,
    productName: string,
    quantity: number,
    unitPricePaid: {
      value: string,
      currency: string
    },
    variantOptions: [
      {
        optionName: string,
        value: string
      }
    ],
    imageUrl: string,
    lineItemType: string
  }[],
  subtotal: {
    value: string,
    currency: string
  },
  shippingTotal: {
    value: string
    currency: string
  },
  discountTotal: {
    value: string,
    currency: string
  },
  taxTotal: {
    value: string,
    currency: string
  },
  refundedTotal: {
    value: string,
    currency: string
  },
  grandTotal: {
    value: string,
    currency: string
  },
  channelName: string,
  externalOrderReference: string,
  fulfilledOn: string,
  priceTaxInterpretation: string
}

type SquarespaceProfile = {
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  isCustomer: boolean,
  createdOn: string,
  transactionSummary: {
    firstOrderSubmittedOn: string,
    lastOrderSubmittedOn: string,
    orderCount: number,
  }
}


export async function getAllSquarespaceOrdersInRange(startDate: string, endDate: string): Promise<SquarespaceOrder[]> {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceOrder[]>(`/squarespace/orders?startDate=${startDate}&endDate=${endDate}`);

  return resp.data;
}

export async function getSquarespaceCustomerByEmail(email: string) {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceProfile>(`/squarespace/profile?email=${email}`);

  return resp.data;
}

export async function getAllSquarespaceOrdersForClientByEmail(email: string) {
  const profile = await getSquarespaceCustomerByEmail(email).catch(() => null);
  if (!profile) return [];
  return await getAllSquarespaceOrdersForClientById(profile.id);
}

export async function getAllSquarespaceOrdersForClientById(id: string) {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceOrder[]>(`/squarespace/orders/customer/${id}`);

  return resp.data;
}
