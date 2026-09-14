import { useEffect, useState } from "react";

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create the ShoppingCart
            const cartRes = await fetch("http://localhost:8080/shoppingcart/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "guest", // replace once auth/user lookup exists
                    totalAmount: total,
                    status: "PENDING",
                }),
            });

            if (!cartRes.ok) throw new Error("Failed to create shopping cart");
            const createdCart = await cartRes.json();

            // 2. Create a CartItem for each product, linked to that cart
            for (const item of cartItems) {
                const itemRes = await fetch("http://localhost:8080/cartitem/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: item.productId,
                        quantity: item.quantity,
                        lineTotal: item.price * item.quantity,
                        shoppingCart: createdCart,
                    }),
                });

                if (!itemRes.ok) throw new Error(`Failed to add item ${item.name}`);
            }

            // 3. Clear local cart on success
            localStorage.removeItem("cart");
            setCartItems([]);
            setOrderPlaced(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <section className="simple-page">
                <p className="section-label">SECURE CHECKOUT</p>
                <h2>Order Confirmed</h2>
                <p>Thanks for your order! We've received it and it's being processed.</p>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="simple-page">
                <p className="section-label">SECURE CHECKOUT</p>
                <h2>Checkout</h2>
                <p>Your cart is empty. Add some products before checking out.</p>
            </section>
        );
    }

    return (
        <section className="simple-page">
            <p className="section-label">SECURE CHECKOUT</p>
            <h2>Checkout</h2>
            <p>Review your order and complete payment.</p>

            <div className="checkout-items">
                {cartItems.map((item) => (
                    <div className="checkout-item" key={item.productId}>
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                        <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="checkout-summary">
                <p className="checkout-total">Total: R{total.toFixed(2)}</p>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
        </section>
    );
}

export default CheckoutPage;