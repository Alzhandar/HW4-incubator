'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProductById } from '../../services/productsService';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const ProductDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setProductId(Array.isArray(id) ? id[0] : id);
    }
  }, [id]);

  const { data: product, error, isLoading } = useProductById(productId);
  const [localProduct, setLocalProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        const foundProduct = products.find((p: Product) => p.id === Number(productId));
        if (foundProduct) {
          setLocalProduct(foundProduct);
        } else if (product) {
          setLocalProduct(product);
        }
      } else if (product) {
        setLocalProduct(product);
      }
    }
  }, [productId, product]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !localProduct) return <div>Error loading product</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="border p-4 rounded shadow">
        <img src={localProduct.image} alt={localProduct.title} className="h-40 w-full object-cover mb-2" />
        <h1 className="text-3xl font-bold mb-4">{localProduct.title}</h1>
        <p className="text-xl mb-4">${localProduct.price}</p>
        <p className="mb-4">{localProduct.description}</p>
        <p className="text-sm text-gray-600">Category: {localProduct.category}</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
