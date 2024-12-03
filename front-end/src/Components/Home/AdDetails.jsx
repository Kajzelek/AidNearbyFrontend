import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AdDetails = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/ads/${adId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAd(data);
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
    <div>
      <h2 className="font-bold text-lg">{ad.adTitle}</h2>
      <p className="text-gray-700">{ad.adDescription}</p>
      <p className="text-gray-700">{ad.adCategory}</p>
      <p className="text-gray-700">{ad.adStatus}</p>
      <span className="text-sm text-gray-500">{ad.adLocation}</span>
      <span className="text-sm text-gray-500">{ad.latitude}, {ad.longitude}</span>
      {/* Dodaj inne szczegóły ogłoszenia tutaj */}
    </div>
  );
};

export default AdDetails;