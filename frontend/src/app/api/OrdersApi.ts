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
            providesTags: (result) => [
                "Orders",
                ...(result?.orders.map((order) => ({
                    type: "Order" as const,
                    id: order.id,
                })) ?? []),
            ],
        }),
        getOrderById: builder.query<Order, number>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [
                { type: "Order", id }
            ],
        }),
        createOrder: builder.mutation<Order, { customer: string; total:number }>({
            query: (newOrder) => ({
                url: "/orders",
                method: "POST",
                body: newOrder,
            }),
            invalidatesTags: ["Orders"],
        }),
        updateOrder: builder.mutation<Order, {id: number; status: OrderStatus}>({
            query: (arg) => ({
                url: `/orders/${arg.id}`,
                method: "PATCH",
                body: {status: arg.status},
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Orders",
                { type: "Order", id },
            ],
        }),
        deleteOrder: builder.mutation<void, {id: number}>({
            query: ({ id }) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Orders"],
        }),
    })
})

export const {
    useGetOrdersQuery,
    useUpdateOrderMutation,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useDeleteOrderMutation,
} = ordersApi;