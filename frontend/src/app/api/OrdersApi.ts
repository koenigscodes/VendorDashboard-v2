import { baseApi } from "./baseApi";

import type { OrderStatus, OrdersResponse } from "../../types/Order";

type GetOrdersArgs = {
    search?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
}

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrdersResponse, GetOrdersArgs>({
            query: (args) => ({
                url: "/orders",
                params: args
            })
        })
    })
})

export const { useGetOrdersQuery } = ordersApi;