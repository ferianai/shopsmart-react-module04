import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext'; 
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);  // State to store products
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories
  const [loading, setLoading] = useState<boolean>(true);    // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Selected category
  const [titleFilter, setTitleFilter] = useState<string>(''); // Title filter
  const [priceMin, setPriceMin] = useState<number | null>(null); // Price min filter
  const [priceMax, setPriceMax] = useState<number | null>(null); // Price max filter
  const { addToCart } = useCart();                          // Use context to manage cart state

  // Fetch categories from the API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories', error);
      setError('Error fetching categories');
    }
  }, []); // Only need to fetch categories once on initial load

  // Fetch products from the API based on applied filters
  const fetchProducts = useCallback(async () => {
    try {
      let url = 'https://api.escuelajs.co/api/v1/products/?';
      const filters: string[] = [];

      // Add filters to the query string
      if (titleFilter) filters.push(`title=${titleFilter}`);
      if (priceMin !== null) filters.push(`price_min=${priceMin}`);
      if (priceMax !== null) filters.push(`price_max=${priceMax}`);
      if (selectedCategory !== null) filters.push(`categoryId=${selectedCategory}`);

      // If there are any filters, join them with '&' and add to the URL
      if (filters.length > 0) {
        url += filters.join('&');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setError('Error fetching products');
      setLoading(false);
    }
  }, [titleFilter, priceMin, priceMax, selectedCategory]); // Re-run this effect when any filter changes

  // Fetch data on initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts(); // Initial fetch for products
  }, [fetchCategories, fetchProducts]); // Dependencies include the memoized functions

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    const productWithQuantity = { ...product, quantity: 1 };
    addToCart(productWithQuantity);
    alert(`${product.title} has been added to your cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>

      {/* Filter Section */}
      <div className="mb-4">
        {/* Filter by Title */}
        <input
          type="text"
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="p-2 border rounded mr-4"
        />

        {/* Filter by Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin || ''}
          onChange={(e) => setPriceMin(Number(e.target.value))}
          className="p-2 border rounded mr-4"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax || ''}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="p-2 border rounded"
        />

        {/* Filter by Category */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="p-2 border rounded ml-4"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-md p-4 shadow-sm hover:shadow-lg transition">
            <Link to={`/products/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md hover:shadow-lg"
              />
              <h2 className="text-lg font-bold mt-2">{product.title}</h2>
            </Link>
            {/* <p>{product.description}</p> */}
            <p>Price: ${product.price}</p>
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

export default Products;
