import { useEffect, useState } from "react";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeItem = (productId) => {
        setCartItems((prev) =>
            prev.filter((item) => item.productId !== productId)
        );
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <section className="simple-page">
                <p className="section-label">YOUR BAG</p>
                <h2>Cart</h2>
                <p>Your cart is empty. Browse the catalog to add products.</p>
            </section>
        );
    }

    return (
        <section className="simple-page">
            <p className="section-label">YOUR BAG</p>
            <h2>Cart</h2>

            <div className="cart-items">
                {cartItems.map((item) => (
                    <div className="cart-item" key={item.productId}>
                        <img
                            src={`data:image/jpeg;base64,${item.productImage}`}
                            alt={item.name}
                            className="cart-item-image"
                        />

                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p>R{item.price.toFixed(2)}</p>

                            <div className="quantity-controls">
                                <button
                                    onClick={() =>
                                        updateQuantity(item.productId, item.quantity - 1)
                                    }
                                >
                                    −
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        updateQuantity(item.productId, item.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="cart-item-line-total">
                            R{(item.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                            className="remove-btn"
                            onClick={() => removeItem(item.productId)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <p className="cart-total">Total: R{total.toFixed(2)}</p>
                <button className="checkout-btn">Proceed to Checkout</button>
            </div>
        </section>
    );
}

export default CartPage;