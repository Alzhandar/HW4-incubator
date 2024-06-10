'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProducts } from './services/productsService';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const HomePage = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setLocalProducts(JSON.parse(storedProducts));
    } else {
      setLocalProducts(products);
    }
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: string[] = Array.from(new Set(localProducts.map((product: Product) => product.category)));

  const filteredProducts = selectedCategory
    ? localProducts.filter((product: Product) => product.category === selectedCategory)
    : localProducts;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-6">OLX</h1>
      <h2 className="text-3xl font-semibold mb-4">Categories</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-white ${
              selectedCategory === category ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-white ${
            selectedCategory === null ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          All
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-4 mb-2">{selectedCategory || 'All Products'}</h2>
      {filteredProducts.length === 0 ? (
        <div>No products available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product: Product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="border p-4 rounded shadow">
                <img src={product.image} alt={product.title} className="h-40 w-full object-cover mb-2" />
                <h3 className="text-lg font-medium">{product.title}</h3>
                <p>${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
