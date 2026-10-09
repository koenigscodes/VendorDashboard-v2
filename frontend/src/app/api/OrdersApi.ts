import { baseApi } from "./baseApi";

import type { Order } from "../../types/Order";

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<Order[], void>({
            query: () => '/orders'
        })
    })
})

export const { useGetOrdersQuery } = ordersApi;