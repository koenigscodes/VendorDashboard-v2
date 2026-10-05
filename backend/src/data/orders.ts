import type { Order } from "../types/order.js";

const orders: Order[] = [
    {
        id: 1,
        customer: "Jordan",
        status: "pending",
        total: 25000
    },
    {
        id: 2,
        customer: "Jay",
        status: "delivered",
        total: 45000
    },
    {
        id: 3,
        customer: "Jord",
        status: "pending",
        total: 65000
    },
];

export default orders;