export type OrderStatus =
    | "pending"
    | "processing"
    | "delivered"
    | "cancelled"
//

export interface Order {
    id: number;
    customer: string;
    status: OrderStatus;
    total: number;
}

export interface OrdersResponse {
    orders: Order[];
    pagination: {
        page: number;
        limit: number;
        totalOrders: number;
        totalPages: number;
    };
}