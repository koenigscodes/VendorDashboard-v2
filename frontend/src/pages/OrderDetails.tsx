import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetOrderByIdQuery, useUpdateOrderMutation} from "../app/api/OrdersApi";

import type { OrderStatus } from "../types/Order";

function OrderDetails () {
    const { id } = useParams();

    const orderId = Number(id);

    const [updateError, setUpdateError] = useState("");

    const {
        data: order, isLoading, isError
    } = useGetOrderByIdQuery(orderId);

    const [
        updateOrder, {isLoading: isUpdating}
    ] = useUpdateOrderMutation();

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

    if (!id || !Number.isInteger(orderId) || orderId < 1) {
        return <p>Invalid Order ID</p>;
    }

    if (isLoading) {
        return <p>Loading order...</p>;
    }

    if (isError && !order) {
        return <p>Failed to load order. Please try again.</p>
    }

    if (!order) {
        return <p>Order not found.</p>
    }
    return (
        <div>
            <h1>Order Details</h1>

            <p>Order ID: {order.id}</p>
            <p>Customer: {order.customer}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₦{order.total.toLocaleString()}</p>
            {updateError && (
                <p role="alert" className="text-red-600">
                    {updateError}
                </p>
            )}
            <div>
                <p>Change order status:</p>
                <div className="flex flew wrap gap-2">
                    <button
                        className="rounded-md px-3 py-2 text-sm font-medium 
                        transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200
                        disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                            handleStatusChange(order.id, "processing")
                        }
                        disabled={isUpdating || order.status === "processing"}
                    >
                        Processing
                    </button>
                    <button
                        className="rounded-md px-3 py-2 text-sm font-medium 
                        transition-colors bg-green-100 text-green-800 hover:bg-green-200
                        disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                            handleStatusChange(order.id, "delivered")
                        }
                        disabled={isUpdating || order.status === "delivered"}
                    >
                        Delivered
                    </button>
                    <button
                        className="rounded-md px-3 py-2 text-sm font-medium 
                        transition-colors bg-red-100 text-red-800 hover:bg-red-200
                        disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                            handleStatusChange(order.id, "cancelled")
                        }
                        disabled={isUpdating || order.status === "cancelled"}
                    >
                        Cancelled
                    </button>
                </div>
                {isUpdating && <p>Updating status...</p>}
            </div>
        </div>
    )
}

export default OrderDetails;