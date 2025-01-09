import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import useCart to access cart functions

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

const DetailProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access addToCart from CartContext

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product (Status: ${response.status})`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        images: product.images,
        quantity: 1, // Initial quantity
      });
      alert(`${product.title} has been added to the cart!`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col items-center m-8 product-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        Go Back
      </button>

      <h1 className="text-3xl font-bold">{product.title || "Product Name"}</h1>

      <div className="category-info mt-4">
        <h2 className="text-xl font-semibold">Category: {product.category?.name || "N/A"}</h2>
        {product.category?.image && (
          <img
            src={product.category.image}
            alt={product.category.name}
            className="w-20 h-20 object-cover mt-2 rounded-md"
          />
        )}
      </div>

      <div className="product-images mt-4">
        {product.images && product.images.length > 0 ? (
          product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} - ${index}`}
              className="object-cover rounded-md mt-2"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mt-4">Description:</h2>
      <p className="mt-4 text-xl">{product.description || "Description is not available."}</p>

      <p className="text-lg font-semibold mt-4">Price: ${product.price || "0.00"}</p>

      <button
        onClick={handleAddToCart}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default DetailProduct;
