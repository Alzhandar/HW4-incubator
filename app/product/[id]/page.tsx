'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProductById } from '../../services/productsService';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../carousel.css';
import { Carousel } from 'react-responsive-carousel';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images?: string[];
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
        const products: Product[] = JSON.parse(storedProducts);
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

  const renderImages = () => {
    if (localProduct.images && localProduct.images.length > 0) {
      return localProduct.images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Product Image ${index + 1}`} className="h-40 w-full object-cover mb-2" />
        </div>
      ));
    } else if (localProduct.image) {
      return [
        <div key={0}>
          <img src={localProduct.image} alt={`Product Image`} className="h-40 w-full object-cover mb-2" />
        </div>
      ];
    } else {
      return [
        <div key={0} className="h-40 w-full bg-gray-200 mb-2 flex items-center justify-center">
          <span>No Image</span>
        </div>
      ];
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="border p-4 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">{localProduct.title}</h1>
        <p className="text-xl mb-4">${localProduct.price}</p>
        <p className="mb-4">{localProduct.description}</p>
        <p className="text-sm text-gray-600">Category: {localProduct.category}</p>
        <Carousel>
          {renderImages()}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductDetailPage;
