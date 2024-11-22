import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const FillOutProfile = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
    bio: '',
    age: '',
    interests: '',
  });

  const [errMsg, setErrMsg] = useState('');

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

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Fill Out Profile</h1>
        {errMsg && <p className="text-red-500 text-sm mb-4">{errMsg}</p>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-600 mb-1">
              First Name
            </label>
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
            <label htmlFor="lastName" className="block text-gray-600 mb-1">
              Last Name
            </label>
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
            <label htmlFor="phoneNumber" className="block text-gray-600 mb-1">
              Phone Number
            </label>
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
            <label htmlFor="address" className="block text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-gray-600 mb-1">
              Profile Picture URL
            </label>
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
            <label htmlFor="bio" className="block text-gray-600 mb-1">
              Bio
            </label>
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
            <label htmlFor="age" className="block text-gray-600 mb-1">
              Age
            </label>
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
            <label htmlFor="interests" className="block text-gray-600 mb-1">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={profileData.interests}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>
    </section>
  );
};

export default FillOutProfile;
