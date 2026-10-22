import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetOrderByIdQuery, useUpdateOrderMutation, useDeleteOrderMutation} from "../app/api/OrdersApi";

import type { OrderStatus } from "../types/Order";
import { formatCurrency } from "../utils/formatCurrency";
import StatusBadge from "../components/StatusBadge";

function OrderDetails () {
    const navigate = useNavigate();
    const { id } = useParams();

    const orderId = Number(id);

    const [updateError, setUpdateError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const {
        data: order, isLoading, isError
    } = useGetOrderByIdQuery(orderId);

    const [
        updateOrder, {isLoading: isUpdating}
    ] = useUpdateOrderMutation();

    const [
        deleteOrder, {isLoading: isDeleting}
    ] = useDeleteOrderMutation();

    const handleStatusChange = async (id: number, status: OrderStatus) => {
        setUpdateError("");

        try {
            await updateOrder({
                id,
                status
            }).unwrap();
        } catch {
            setUpdateError(
                "Failed to update order. Please check your connection and try again."
            );
        }
    };

    const handleDeleteOrder = async (id: number) => {
        try {
            await deleteOrder({ id }).unwrap();
            navigate("/dashboard/orders");
        } catch {
            setDeleteError(
                "Failed to delete order. Please check your connection and try again."
            );
        }
    };

    if (!id || !Number.isInteger(orderId) || orderId < 1) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                Invalid order ID.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-48 rounded bg-slate-200" />
                <div className="h-48 rounded-xl bg-slate-100" />
                <div className="h-40 rounded-xl bg-slate-100" />
                <div className="h-35 rounded-xl bg-slate-100" />
            </div>
        );
    }

    if (isError && !order) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">
                    Failed to load order.
                </p>
                <p className="mt-1 text-sm text-red-600">
                    Please check your connection and try again.
                </p>
                <button
                    onClick={() => navigate("/dashboard/orders")}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return <p className="text-slate-600">Order not found.</p>;
    }


    return (
        <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Page header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Order Details
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage this order
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard/orders")}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                    ← Back to Orders
                </button>
            </div>

            {/* Order information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <p className="text-sm text-slate-500">Order ID</p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                            #{order.id}
                        </h2>
                    </div>

                    <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-1 gap-5 pt-5 min-[530px]:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Customer</p>
                        <p className="mt-2 font-semibold text-slate-900">
                            {order.customer}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Order total</p>
                        <p className="mt-2 text-xl font-bold text-slate-900">
                            {formatCurrency(order.total)}
                        </p>
                    </div>
                </div>
            </section>

            {/* Status management */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-semibold text-slate-900">
                    Manage order
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Select the appropriate status for this order
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        className="rounded-lg bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleStatusChange(order.id, "processing")}
                        disabled={isUpdating || order.status === "processing"}
                    >
                        Mark as Processing
                    </button>

                    <button
                        className="rounded-lg bg-green-100 px-4 py-2.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleStatusChange(order.id, "delivered")}
                        disabled={isUpdating || order.status === "delivered"}
                    >
                        Mark as Delivered
                    </button>

                    <button
                        className="rounded-lg bg-red-100 px-4 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        disabled={isUpdating || order.status === "cancelled"}
                    >
                        Cancel Order
                    </button>
                </div>

                {isUpdating && (
                    <p role="status" className="mt-4 text-sm text-slate-500">
                        Updating order status...
                    </p>
                )}

                {updateError && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {updateError}
                    </p>
                )}
            </section>

            {/* Destructive action */}
            <section className="rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
                <h2 className="font-semibold text-slate-900">
                    Delete this order
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Remove this order from the dashboard. This action cannot be
                    undone.
                </p>

                <button
                    onClick={() => handleDeleteOrder(order.id)}
                    disabled={isDeleting || isUpdating}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Delete Order"}
                </button>
                {deleteError && (
                    <p
                        role="alert"
                        className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {deleteError}
                    </p>
                )}
            </section>
        </div>
    );

}

export default OrderDetails;