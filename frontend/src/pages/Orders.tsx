import { useGetOrdersQuery } from "../app/api/OrdersApi";
import { useEffect, useState } from "react";

import type { OrderStatus } from "../types/Order";

function Orders() {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState<OrderStatus | "">("");
    const [page, setPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const {
        data,
        isLoading,
        isError
    } = useGetOrdersQuery({
        search: debouncedSearch,
        ...(status ? {status: status as OrderStatus} : {}),
        page,
        limit,
    });

    if (isLoading) {
        return <p>loading orders</p>
    }

    if (isError) {
        return <p>Failed to load orders</p>
    }

    return (
        <div>
            <p>Filter</p>
            <select
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value as OrderStatus| "");
                    setPage(1)
                }}
            >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {data && data.orders.length === 0 ? (
                <p>No orders match your search</p>
            ) : (
                data?.orders.map(order => (
                    <div key={order.id}>
                        <h2>{order.customer}</h2>
                        <p>{order.status}</p>
                        <p>{order.total}</p>
                    </div>
                ))
            )}
            {data && data.pagination.totalPages > 0 && (
                <div>
                    <button
                        disabled={page ===1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span>Page{data.pagination.page} of {data.pagination.totalPages}</span>
                    <button
                        disabled={page >= data.pagination.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default Orders;