import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const CreateAdForm = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [useMap, setUseMap] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: null, lng: null });
  // const [base64Image, setBase64Image] = useState('');

  const categories = [
    { adCategoryId: 1, categoryName: 'Electronics' }, 
    { adCategoryId: 2, categoryName: 'Furniture' },
    { adCategoryId: 3, categoryName: 'Vehicles' },
    { adCategoryId: 4, categoryName: 'Jobs' },
    { adCategoryId: 5, categoryName: 'Services' },
  ];

  const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      if (useMap && selectedCoordinates.lat && selectedCoordinates.lng) {
        data.latitude = selectedCoordinates.lat;
        data.longitude = selectedCoordinates.lng;
      }


      console.log('Data sent to backend:', data);
      console.log('Base64 adImage:', data.adImage); 

      await apiClient.post('/api/ads/createAd', data, {
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

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       let base64String = reader.result;
  //       // Usuń prefiks `data:image/*;base64,` z danych Base64
  //       base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  //       setBase64Image(base64String);
  //       setValue('adImage', base64String); // Ustawienie wartości w react-hook-form
  //       setValue('adImagePreview', base64String); // Do podglądu w interfejsie
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!document.getElementById('googleMaps')) {
        const script = document.createElement('script');
        script.id = 'googleMaps';
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    const google = window.google;
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 52.2297, lng: 21.0122 },
      zoom: 8,
    });

    const marker = new google.maps.Marker({
      position: { lat: 52.2297, lng: 21.0122 },
      map,
      draggable: true,
    });

    marker.addListener('dragend', (event) => {
      setSelectedCoordinates({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    });
  };

  useEffect(() => {
    if (isMapModalOpen) {
      setTimeout(() => initializeMap(), 500);
    }
  }, [isMapModalOpen]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Advertisement
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Ad Image */}

          {/* <div>
            <label className="block text-gray-600 mb-2">Ad Image</label>
            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition duration-300">
          
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />

              {!watch('adImagePreview') ? (
                <span className="text-gray-400 font-medium">Click to add an image</span>
              ) : (
                <img
                  src={watch('adImagePreview')}
                  alt="Ad preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          </div> */}

          {/* Ad Title */}
          <div className="relative">
            <label className="block text-gray-600 mb-2">Ad Title</label>
            <input
              {...register('adTitle', { required: true })}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ad title"
            />
          </div>

          {/* Ad Category */}
          <div>
            <label className="block text-gray-600 mb-2">Ad Category</label>
            <select
              {...register('adCategory', { required: true })}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.adCategoryId} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Ad Description */}
          <div>
            <label className="block text-gray-600 mb-2">Ad Description</label>
            <textarea
              {...register('adDescription', { required: true })}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            ></textarea>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-600 mb-2">Location</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className={`py-2 px-4 rounded-lg ${
                  useMap ? 'bg-gray-300' : 'bg-blue-500 text-white'
                }`}
                onClick={() => setUseMap(false)}
              >
                Manual
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-lg ${
                  useMap ? 'bg-blue-500 text-white' : 'bg-gray-300'
                }`}
                onClick={() => setUseMap(true)}
              >
                Map
              </button>
            </div>
          </div>

          {!useMap ? (
            <div>
              <label className="block text-gray-600 mb-2">Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register('adLocation', { required: true })}
                  type="text"
                  placeholder="Enter address"
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setIsMapModalOpen(true)}
              >
                Open Map
              </button>
              <div>
                <p>Lat: {selectedCoordinates.lat || 'N/A'}, Lng: {selectedCoordinates.lng || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Ad Status */}
          <div>
            <label className="block text-gray-600 mb-2">Ad Status</label>
            <select
              {...register('adStatus', { required: true })}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white w-3/4 h-3/4 p-4 rounded-lg shadow-lg">
            {/* Przycisk zamykający modal */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white  shadow hover:bg-red-600 z-50"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Kontener mapy */}
            <div id="map" className="w-full h-full rounded-lg border"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAdForm;
