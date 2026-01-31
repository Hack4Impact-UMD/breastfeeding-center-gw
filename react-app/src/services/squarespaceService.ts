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

export async function getAllSquarespaceOrdersInRange(startDate: string, endDate: string): Promise<SquarespaceOrder[]> {
  const axios = await axiosClient();
  const resp = await axios.get<SquarespaceOrder[]>(`/squarespace/orders?startDate=${startDate}&endDate=${endDate}`);

  return resp.data;
}
