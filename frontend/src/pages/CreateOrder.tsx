import { useEffect, useState } from "react";

import { useCreateOrderMutation } from "../app/api/OrdersApi";

const CreateOrder = () => {
    const [customer, setCustomer] = useState("");
    const [total, setTotal] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!isSubmitted) return;

        const timer = setTimeout(() => {
            setIsSubmitted(false)
        }, 1500);

        return () => clearTimeout(timer);
    }, [isSubmitted]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            await createOrder({
                customer,
                total: Number(total),
            }).unwrap();

            setCustomer("");
            setTotal("");
            setIsSubmitted(true);

        } catch (error) {
            console.error("Failed to create order:", error)
        }
    };

    return (
        <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">
                    Create Order
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="customer"
                            className="mb-2 block text-lg font-medium text-slate-700"
                        >
                            Customer name
                        </label>
                        <input
                            id="customer"
                            type="text"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            required
                            minLength={3}
                            placeholder="Enter customer name"
                            className="w-full rounded-lg border border-slate-400 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="total"
                            className="mb-2 block text-lg font-medium text-slate-700"
                        >
                            Total amount
                        </label>
                        <input
                            id="total"
                            type="number"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            required
                            min="0.00"
                            placeholder="Enter order total"
                            className="w-full rounded-lg border border-slate-400 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex justify-center">
                       <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Creating order..." : "Create Order"}
                        </button>
                    </div>

                    {isSubmitted && (
                        <p
                            role="status"
                            className="mt-4 rounded-lg bg-green-100 p-3 text-center text-sm font-medium text-green-600"
                        >
                            Order created successfully!
                        </p>
                    )}
                    {error && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-600"
                        >
                            Failed to create order. Please check your connection and try again.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CreateOrder;