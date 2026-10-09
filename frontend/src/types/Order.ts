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