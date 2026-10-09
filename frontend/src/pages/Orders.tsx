import { useGetOrdersQuery } from "../app/api/OrdersApi";

function Orders() {
    const {
    data,
    isLoading,
    isError
} = useGetOrdersQuery();

    if (isLoading) {
        return <p>loading orders</p>
    }

    if (isError) {
        return <p>Failed to load orders</p>
    }

    return (
        <div>
            {data?.map(order => (
                <div key={order.id}>
                    <h2>{order.customer}</h2>
                    <p>{order.status}</p>
                    <p>{order.total}</p>
                </div>
            ))}
        </div>
    )
}

export default Orders;