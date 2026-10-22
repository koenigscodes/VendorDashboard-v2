import { useGetOrdersQuery, } from "../app/api/OrdersApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { OrderStatus } from "../types/Order";
import { formatCurrency } from "../utils/formatCurrency";
import StatusBadge from "../components/StatusBadge";

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
        isFetching,
        isError,
        refetch,
    } = useGetOrdersQuery({
        search: debouncedSearch,
        ...(status ? {status: status as OrderStatus} : {}),
        page,
        limit,
    });

    if (isLoading) {
    return (
        <div>
            <div className="hidden min-[530px]:grid grid-cols-4 gap-4 border-b bg-slate-100 p-4 font-semibold">
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Action</span>
            </div>

            {[1, 2, 3, 4, 5, 6].map((row) => (
                <div
                    key={row}
                    className="grid grid-cols-2 min-[530px]:grid-cols-4 items-center gap-4 border-b p-4 animate-pulse"
                >
                    <div className="space-y-2">
                        <span className="text-xs text-slate-500 min-[530px]:hidden">
                            Customer
                        </span>
                        <div className="h-4 w-24 rounded bg-slate-200" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-slate-500 min-[530px]:hidden">
                            Total
                        </span>
                        <div className="h-4 w-20 rounded bg-slate-200" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-slate-500 min-[530px]:hidden">
                            Status
                        </span>
                        <div className="h-4 w-16 rounded bg-slate-200" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs text-slate-500 min-[530px]:hidden">
                            Action
                        </span>
                        <div className="h-4 w-20 rounded bg-slate-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

    if (isError && !data) {
        return (
            <div className="flex justify-center items-center text-center h-screen bg-blue-300 p-8">
                <div>
                    <p>Failed to load orders. Please check your connection and try again.</p>
                    <button
                        onClick={() => refetch()}
                    >
                        Retry
                    </button>
                </div>

            </div>
        )
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

            {isFetching && (
                <p className="text-sm text-slate-800" role="status">
                    Updating orders...
                </p>
            )}

            {isError && data && (
                <div
                    className="rounded-md bg-red-100 p-3 text-sm text-red-700"
                    role="alert"
                >
                    Couldn't refresh orders. Showing previously loaded orders.
                    <button
                        className="ml-2 underline"
                        onClick={() => refetch()}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="hidden min-[530px]:grid grid-cols-4 gap-4 border-b bg-slate-200 p-4 font-semibold">
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Action</span>
            </div>

            {data && data.orders.length === 0 ? (
                debouncedSearch || status !== "" ? (
                    <p>No orders match your search</p>
                ) : (
                    <p>No orders found</p>
                )
            ) : (
                data?.orders.map(order => {
                    return (
                        <div
                            key={order.id}
                            className="grid grid-cols-2 min-[530px]:grid-cols-4 items-center gap-4 border-b p-4"
                        >
                            <div>
                                <span className="text-sm text-slate-800 min-[530px]:hidden">
                                    Customer
                                </span>
                                <h2>{order.customer}</h2>
                            </div>
                            <div>
                                <span className="text-sm text-slate-800 min-[530px]:hidden">
                                    Total
                                </span>
                                <p>{formatCurrency(order.total)}</p>
                            </div>
                            <div>
                                {/* <span className="text-sm text-slate-800 min-[530px]:hidden">
                                    Status
                                </span> */}
                                <StatusBadge status={order.status} />
                            </div>
                            <div>
                                {/* <span className="text-sm text-slate-800 min-[530px]:hidden">
                                    Action
                                </span> */}
                                <Link to={`/dashboard/orders/${order.id}`}>
                                    View order
                                </Link>
                            </div>
                        </div>
                    )
                })
            )}

            {data && data.pagination.totalPages > 0 && (
                <div>
                    <button
                        disabled={page === 1}
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