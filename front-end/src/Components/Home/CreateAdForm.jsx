import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const CreateAdForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState([]);

  const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Adres backendu
  });

  useEffect(() => {
    // Pobierz dostępne kategorie z backendu
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await apiClient.get('/api/ad-categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }
  
      // Konwersja `adCategory` ze stringa do obiektu
      const parsedCategory = JSON.parse(data.adCategory);
  
      const payload = {
        ...data,
        adCategory: parsedCategory, // Zamiana na obiekt
      };
  
      console.log('Data sent to backend:', payload);
  
      const response = await apiClient.post('/api/ads/createAd', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert('Ad created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Failed to create ad.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Advertisement</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-600">Ad Title</label>
            <input
              {...register('adTitle', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter ad title"
            />
          </div>
          <div>
            <label className="block text-gray-600">Ad Category</label>
            <select
              {...register('adCategory', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.adCategoryId} value={JSON.stringify(category)}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Ad Description</label>
            <textarea
              {...register('adDescription', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter description"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-600">Ad Location</label>
            <input
              {...register('adLocation', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="block text-gray-600">Ad Status</label>
            <select
              {...register('adStatus', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdForm;
