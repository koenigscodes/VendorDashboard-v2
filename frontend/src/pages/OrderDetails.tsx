import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetOrderByIdQuery, useUpdateOrderMutation} from "../app/api/OrdersApi";

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

    const handleMarkDelivered = async (id: number) => {
        setUpdateError("");

        try {
            await updateOrder({
                id,
                status: "delivered"
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
            <button
                onClick={() => handleMarkDelivered(order.id)}
                disabled={isUpdating || order.status === "delivered"}
            >
                {isUpdating ? "updating" : "Mark as delivered"}
            </button>
        </div>
    )
}

export default OrderDetails;