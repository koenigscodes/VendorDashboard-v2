import type { OrderStatus } from "../types/Order";

type StatusBadgeProps = {
    status: OrderStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<OrderStatus, string> = {
        pending: "bg-amber-100 text-amber-800",
        processing: "bg-blue-100 text-blue-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
        >
            {status}
        </span>
    );
}

export default StatusBadge;
