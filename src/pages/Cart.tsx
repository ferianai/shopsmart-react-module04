import React from "react";
import { useCart } from "../context/CartContext"; // Make sure to use CartContext
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useCart(); // Add clearCart
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  // Remove product from cart
  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  // Increase quantity of product
  const handleIncreaseQuantity = (productId: number) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      updateCartQuantity(productId, product.quantity + 1); // Update quantity by 1
    }
  };

  // Decrease quantity of product
  const handleDecreaseQuantity = (productId: number) => {
    const product = cart.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      updateCartQuantity(productId, product.quantity - 1); // Update quantity by -1, but ensure it's at least 1
    } else {
      handleRemoveFromCart(productId); // If quantity is 1 or less, remove product from cart
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length > 0) {
      clearCart(); // Clear the cart after checkout
      alert("Thank you for your purchase!");
      navigate("/payment-success"); // Navigate to the success page
    }
  };

  return (
    <div className="cart-container">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 mt-4">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
              <img className="cart-item-image" src={product.images[0]} alt={product.title} />
              <div className="cart-item-details">
                <h2>{product.title}</h2>
                <p>${product.price}</p>
                <div className="cart-item-actions">
                  <button onClick={() => handleRemoveFromCart(product.id)}>- Remove</button>
                  <div className="quantity">
                    <button onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Total: ${totalPrice}</h3>
          <div className="checkout-button">
            {localStorage.getItem("user_email") ? (
              <button onClick={handleCheckout}>Checkout</button>
            ) : (
              <Link to="/login">Login to Checkout</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
