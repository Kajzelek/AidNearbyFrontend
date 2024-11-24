import { useForm } from 'react-hook-form';
import axios from 'axios';

const CreateAdForm = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token'); // Załóżmy, że token jest w LocalStorage
      const response = await axios.post(
        '/api/ads/createAd',
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
              <option value="CATEGORY_1">Category 1</option>
              <option value="CATEGORY_2">Category 2</option>
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