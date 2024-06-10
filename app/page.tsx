'use client';
import './styles.css';
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
  images?: string[];
}

const HomePage = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setLocalProducts(parsedProducts);
      console.log('Loaded products from localStorage:', parsedProducts);
    } else {
      setLocalProducts(products);
    }
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: string[] = Array.from(new Set(localProducts.map((product: Product) => product.category)));

  const filteredProducts = selectedCategory
    ? localProducts.filter((product: Product) => product.category === selectedCategory)
    : localProducts.filter((product: Product) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(null); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex items-center w-full max-w-lg space-x-2">
          <div className="flex items-center border border-gray-300 rounded-l-md p-2 w-full">
            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
            </svg>
            <input
              type="text"
              placeholder="Что ищете?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 outline-none w-full"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
            Поиск
          </button>
        </form>
      </div>

      <h1 className="text-3xl font-bold my-6">Categories</h1>
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
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} className="h-40 w-full object-cover mb-2" />
                ) : product.image ? (
                  <img src={product.image} alt={product.title} className="h-40 w-full object-cover mb-2" />
                ) : (
                  <div className="h-40 w-full bg-gray-200 mb-2 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
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
