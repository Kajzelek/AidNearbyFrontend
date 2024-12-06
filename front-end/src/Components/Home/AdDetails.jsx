import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdDetails = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/ads/${adId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAd(data);
        console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!ad) {
    return <p>Ogłoszenie nie zostało znalezione</p>;
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {/* Miejsce na zdjęcie */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 md:mb-0">
              {/* Placeholder na zdjęcie */}
              <img src={ad.imagePath || 'https://via.placeholder.com/300'} alt={ad.adTitle} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h2 className="font-bold text-2xl mb-4">{ad.adTitle}</h2>
            <p className="text-gray-700 mb-2">{ad.adDescription}</p>
            <p className="text-gray-700 mb-2"><strong>Kategoria:</strong> {ad.adCategory}</p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {ad.adStatus}</p>
            {ad.adLocation && <p className="text-gray-700 mb-2"><strong>Lokalizacja:</strong> {ad.adLocation}</p>}
            {(ad.latitude && ad.longitude) && <p className="text-gray-700 mb-2"><strong>Koordynaty:</strong> {ad.latitude}, {ad.longitude}</p>}
            {/* Dodaj inne szczegóły ogłoszenia tutaj */}
            <div className="mt-6 flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Napisz wiadomość
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
                Zgłoś się
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;