import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Assuming CartContext is set up correctly

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);  // State to store products
  const [loading, setLoading] = useState<boolean>(true);    // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state
  const { addToCart } = useCart();                          // Use context to manage cart state

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setError('Error fetching products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Add quantity to the product object
    const productWithQuantity = { ...product, quantity: 1 };
    addToCart(productWithQuantity);  // Add product to cart
    alert(`${product.title} has been added to your cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-6xl font-bold mb-4 text-center pt-4 text-blue-950">ShopSmart Online Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-md p-4 shadow-sm hover:shadow-lg transition">
            <Link to={`/products/${product.id}`}>
              <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
            </Link>
            <button 
              onClick={() => handleAddToCart(product)} 
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
