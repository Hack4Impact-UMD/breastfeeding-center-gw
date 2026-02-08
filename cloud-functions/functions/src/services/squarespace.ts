import axios, { AxiosInstance } from "axios"
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
  customerEmail: string | null,
  customerId: string | null,
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

export type SquarespaceProfile = {
  id: string,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
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

let ssClient: AxiosInstance | null = null;

const squarespaceClient = () => {
  if (ssClient) return ssClient;

  ssClient = axiosRateLimit(axios.create({
    baseURL: "https://api.squarespace.com",
    headers: {
      Authorization: `Bearer ${config.squarespaceAPIKey.value()}`
    }
  }), { maxRPS: 5 });

  return ssClient;
}

export async function getSquarespaceCustomer(email: string) {
  const axios = squarespaceClient();

  const resp = await axios.get<SquarespaceProfilesResponse>(`/1.0/profiles?filter=email,${encodeURIComponent(email)}`);
  const { profiles } = resp.data;

  if (profiles.length === 0 || !profiles[0].isCustomer) throw new Error(`No customers found with email ${email}`)

  return profiles[0];
}

export async function getAllCustomers() {
  const client = squarespaceClient();
  const resp = await client.get<SquarespaceProfilesResponse>("/1.0/commerce/profiles?filter=isCustomer,true");
  let pagination = resp.data.pagination;
  const collectedProfiles: SquarespaceProfile[] = [...resp.data.profiles];

  while (pagination.hasNextPage) {
    const nextPageResp = await client.get<SquarespaceProfilesResponse>(`/1.0/commerce/profiles?cursor=${pagination.nextPageCursor}`);
    collectedProfiles.push(...nextPageResp.data.profiles);
    pagination = nextPageResp.data.pagination
  }

  return collectedProfiles;
}

export async function getPaginatedOrders(cursor: string) {
  const client = squarespaceClient();
  const resp = await client.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?cursor=${cursor}`);
  const collectedOrders = [...resp.data.result];
  let pagination = resp.data.pagination;

  while (pagination.hasNextPage) {
    logger.info(`squarespace: fetching orders cursor ${pagination.nextPageCursor}`)
    const nextPageResp = await client.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?cursor=${pagination.nextPageCursor}`);
    const { result: nextOrders, pagination: nextPagination } = nextPageResp.data;

    collectedOrders.push(...nextOrders);
    pagination = nextPagination;
  }

  return collectedOrders;
}

export async function getOrdersInRange(startDate: string, endDate: string) {
  const client = squarespaceClient();
  const resp = await client.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?modifiedAfter=${encodeURIComponent(startDate)}&modifiedBefore=${encodeURIComponent(endDate)}&fulfillmentStatus=FULFILLED`);
  const { result: orders, pagination } = resp.data;

  if (pagination.hasNextPage) {
    return [...orders, ...(await getPaginatedOrders(pagination.nextPageCursor))]
  }
  return orders;
}

export async function getOrdersForCustomerId(id: string) {
  const client = squarespaceClient();
  const resp = await client.get<SquarespaceOrdersResponse>(`/1.0/commerce/orders?customerId=${id}&fulfillmentStatus=FULFILLED`);
  const { result: orders, pagination } = resp.data;

  if (pagination.hasNextPage) {
    return [...orders, ...(await getPaginatedOrders(pagination.nextPageCursor))]
  }

  return orders
}

export async function getCustomersByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const client = squarespaceClient();
  const chunkSize = 50;

  const customers: SquarespaceProfile[] = []

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const resp = await client.get<SquarespaceProfilesResponse>(`/1.0/profiles/${chunk.join(",")}`);

    customers.push(...resp.data.profiles);
  }

  return customers;
}
