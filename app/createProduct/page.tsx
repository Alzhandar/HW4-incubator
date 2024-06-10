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
      setImageFiles(Array.from(e.target.files));
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
        image: imageUrls[0], 
      };

      createProduct(productData, {
        onSuccess: () => {
          alert('Product created successfully');
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
          <label className="block text-sm font-medium">Images</label>
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
