import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FillOutProfile = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '', // Zmieniono 'address' na 'location'
    profilePicture: '',
    bio: '',
    age: '',
    interests: '',
  });

  const [errMsg, setErrMsg] = useState('');
  const [useMap, setUseMap] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: null, lng: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/FillOutProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileData,
          interests: profileData.interests
            .split(',')
            .map((interest) => interest.trim()),
          latitude: selectedCoordinates.lat,
          longitude: selectedCoordinates.lng,
        }),
      });

      if (response.ok) {
        alert('Profile saved successfully!');
        setAuth((prev) => ({ ...prev, isNewUser: false }));
        navigate('/', { replace: true });
      } else {
        const errorData = await response.json();
        setErrMsg(errorData.message || 'Failed to save profile');
      }
    } catch (error) {
      setErrMsg('An error occurred while saving the profile.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isMapModalOpen) {
      setTimeout(() => initializeMap(), 500);
    }
  }, [isMapModalOpen]);

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

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Fill Out Profile</h1>
        {errMsg && <p className="text-red-500 text-sm mb-4">{errMsg}</p>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-600 mb-1">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              {useMap ? (
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border rounded-lg"
                  placeholder="Use the map to select location"
                  disabled
                />
              ) : (
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border rounded-lg"
                  placeholder="Enter location manually"
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-gray-600 mb-1">Profile Picture URL</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={profileData.profilePicture}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-gray-600 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label htmlFor="age" className="block text-gray-600 mb-1">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profileData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="interests" className="block text-gray-600 mb-1">Interests (comma-separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={profileData.interests}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Location</label>
            <div className="flex items-center space-x-4">

              <button
                type="button"
                className={`py-2 px-4 rounded-lg ${useMap ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                onClick={() => setUseMap(false)}
              >
                Manual
              </button>

              <button
                type="button"
                className={`py-2 px-4 rounded-lg ${useMap ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setUseMap(true)}
              >
                Map
              </button>
              
            </div>
          </div>
          {useMap ? (
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
          ) : null}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white w-3/4 h-3/4 p-4 rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white shadow hover:bg-red-600"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Map Container */}
            <div id="map" className="w-full h-full rounded-lg border"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FillOutProfile;
