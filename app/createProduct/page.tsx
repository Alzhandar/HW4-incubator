'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProduct, uploadImage } from '../services/productsService';

const CreateProductPage = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const router = useRouter();

  const { mutate: createProduct } = useCreateProduct();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 8) {
        alert('You can upload a maximum of 8 images');
        return;
      }
      setImageFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const uploadResponse = await uploadImage(file);
        imageUrls.push(uploadResponse.location);
      }

      const productData = {
        title,
        price: parseFloat(price),
        category,
        description,
        images: imageUrls, 
      };

      createProduct(productData, {
        onSuccess: () => {
          alert('Product created successfully');
          const storedProducts = localStorage.getItem('products');
          const products = storedProducts ? JSON.parse(storedProducts) : [];
          products.push({ ...productData, id: Date.now() }); 
          localStorage.setItem('products', JSON.stringify(products));
          console.log('Product saved to localStorage:', productData);

          router.push('/'); 
        },
        onError: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product');
        }
      });
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Failed to upload images');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Create New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Images (max 8)</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
