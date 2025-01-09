import React, { createContext, useState, useContext, ReactNode } from 'react';

// Typing the product object with quantity property added to it for cart management purposes 
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  quantity: number; // Added quantity to the product object
}

// Typing the CartContextType with the new function for updating quantity of a product in the cart
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void; // Added function for updating quantity
  clearCart: () => void;
}

// Creating the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to access CartContext
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Typing CartProvider's props to accept children
interface CartProviderProps {
  children: ReactNode; // Correctly typed 'children' prop
}

// CartProvider component to provide context value
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => { // Now 'children' is typed correctly
  const [cart, setCart] = useState<Product[]>([]);

  // Add product to cart or increment quantity if already exists
  const addToCart = (product: Product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]); // Initialize quantity to 1 if it's a new product
    }
  };

  // Remove product from cart
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update product quantity in the cart
  const updateCartQuantity = (id: number, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
