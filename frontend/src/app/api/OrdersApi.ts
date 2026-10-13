import { baseApi } from "./baseApi";

import type { OrderStatus, OrdersResponse, Order } from "../../types/Order";

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
            }),
            providesTags: ["Orders"]
        }),
        getOrderById: builder.query<Order, number>({
            query: (id) => `/orders/${id}`,
            providesTags: ["Orders"],
        }),
        updateOrder: builder.mutation<Order, {id: number; status: OrderStatus}>({
            query: (arg) => ({
                url: `/orders/${arg.id}`,
                method: "PATCH",
                body: {status: arg.status},
            }),
            invalidatesTags: ["Orders"]
        })
    })
})

export const { useGetOrdersQuery, useUpdateOrderMutation, useGetOrderByIdQuery } = ordersApi;