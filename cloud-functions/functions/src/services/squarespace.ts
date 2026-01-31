import axios from "axios"
import axiosRateLimit from "axios-rate-limit"
import { config } from "../config"
import { logger } from "firebase-functions/v1"

type SquarespaceOrdersResponse = {
  result: SquarespaceOrder[],
  pagination: SquarespacePagination
}

type SquarespaceOrder = {
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

type SquarespaceProfilesResponse = {
  profiles: SquarespaceProfile[],
  pagination: SquarespacePagination
}

type SquarespacePagination = {
  hasNextPage: boolean,
  nextPageCursor: string,
  nextPageUrl: string
}

const squarespaceClient = () => {
  const client = axiosRateLimit(axios.create({
    baseURL: "https://api.squarespace.com",
    headers: {
      Authorization: `Bearer ${config.squarespaceAPIKey.value()}`
    }
  }), { maxRPS: 5 });

  return client;
}

export async function getSquarespaceCustomerId(email: string) {
  const axios = squarespaceClient();

  const resp = await axios.get<SquarespaceProfilesResponse>(`/1.0/profiles?filter=${email},${encodeURIComponent(email)}`);
  const { profiles } = resp.data;

  if (profiles.length === 0 || !profiles[0].isCustomer) throw new Error(`No customers found with email ${email}`)

  return profiles[0];
}

export async function getPaginatedOrders(cursor: string) {
  const axios = squarespaceClient();
  const resp = await axios.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?cursor=${cursor}`);
  const collectedOrders = [...resp.data.result];
  let pagination = resp.data.pagination;

  while (pagination.hasNextPage) {
    logger.info(`squarespace: fetching orders cursor ${pagination.nextPageCursor}`)
    const nextPageResp = await axios.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?cursor=${pagination.nextPageCursor}`);
    const { result: nextOrders, pagination: nextPagination } = nextPageResp.data;

    collectedOrders.push(...nextOrders);
    pagination = nextPagination;
  }

  return collectedOrders;
}

export async function getOrdersInRange(startDate: string, endDate: string) {
  const axios = squarespaceClient();
  const resp = await axios.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?modifiedAfter=${startDate}&modifiedBefore=${endDate}&fulfillmentStatus=FULFILLED`);
  const { result: orders, pagination } = resp.data;

  if (pagination.hasNextPage) {
    return [...orders, ...(await getPaginatedOrders(pagination.nextPageCursor))]
  }
  return orders;
}

// NOTE: This will only return the most recent 50 orders, doesn't seem to be a way to get around it
export async function getOrdersForCustomerId(id: string) {
  const resp = await axios.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?customerId=${id}&fulfillmentStatus=FULFILLED`);
  const { result: orders } = resp.data;
  return orders
}
