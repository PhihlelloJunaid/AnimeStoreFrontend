import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function CartIcon() {
    const [itemCount, setItemCount] = useState(0);

    const updateCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(total);
    };

    useEffect(() => {
        updateCount();

        // Update when localStorage changes in another tab
        window.addEventListener("storage", updateCount);

        // Update when cart changes in THIS tab (custom event)
        window.addEventListener("cart-updated", updateCount);

        return () => {
            window.removeEventListener("storage", updateCount);
            window.removeEventListener("cart-updated", updateCount);
        };
    }, []);

    return (
        <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
            )}
        </Link>
    );
}

export default CartIcon;