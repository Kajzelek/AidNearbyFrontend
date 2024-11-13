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
      const token = localStorage.getItem('token'); // Pobieramy token z localStorage
      console.log('Token:', token);

      const response = await fetch('http://localhost:8080/FillOutProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileData,
          interests: profileData.interests.split(',').map((interest) => interest.trim()),
        }),
      });



      if (response.ok) {
        alert("Profil został zapisany!");

        console.log(JSON.stringify(response?.data));
        // Aktualizacja wartości isNewUser na false w stanie aplikacji
        setAuth(prev => ({ ...prev, isNewUser: false }));
        // Przekierowanie na stronę główną po wypełnieniu formularza
        navigate('/', { replace: true });

      } else {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Błąd podczas zapisywania profilu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={profileData.firstName}
        onChange={handleChange}
        required
      />

      <label htmlFor="lastName">Last Name:</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={profileData.lastName}
        onChange={handleChange}
        required
      />

      <label htmlFor="phoneNumber">Phone Number:</label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        value={profileData.phoneNumber}
        onChange={handleChange}
      />

      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        name="address"
        value={profileData.address}
        onChange={handleChange}
      />

      <label htmlFor="profilePicture">Profile Picture URL:</label>
      <input
        type="text"
        id="profilePicture"
        name="profilePicture"
        value={profileData.profilePicture}
        onChange={handleChange}
      />

      <label htmlFor="bio">Bio:</label>
      <textarea
        id="bio"
        name="bio"
        value={profileData.bio}
        onChange={handleChange}
      ></textarea>

      <label htmlFor="age">Age:</label>
      <input
        type="number"
        id="age"
        name="age"
        value={profileData.age}
        onChange={handleChange}
      />

      <label htmlFor="interests">Interests (comma-separated):</label>
      <input
        type="text"
        id="interests"
        name="interests"
        value={profileData.interests}
        onChange={handleChange}
      />

      <button type="submit">Save Profile</button>
    </form>
  );
};

export default FillOutProfile;
