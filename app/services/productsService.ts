import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com'
});

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchProductById = async (id: string | null): Promise<Product | null> => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    const products = JSON.parse(storedProducts);
    const product = products.find((product: Product) => product.id === Number(id));
    if (product) {
      return product;
    }
  }

  const response = await api.get(`/products/${id}`);
  return response.data || null;
};

export const useProducts = () => {
  return useQuery<Product[], Error>('products', fetchProducts);
};

export const useProductById = (id: string | null) => {
  return useQuery<Product | null, Error>(['product', id], () => fetchProductById(id), { enabled: !!id });
};

export const createProduct = async (productData: any): Promise<Product> => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    }
  });
};

export const uploadImage = async (imageFile: File): Promise<{ location: string }> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
