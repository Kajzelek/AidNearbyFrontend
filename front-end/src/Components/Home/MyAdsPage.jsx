import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyAdsPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [ads, setAds] = useState({ ACTIVE: [], FINISHED: [] });

  useEffect(() => {
    const fetchAds = async (status) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/ads/getAdsByUserId?status=${status}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAds(prevState => ({ ...prevState, [status]: data }));
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds('ACTIVE');
    fetchAds('FINISHED');
  }, []);

  const renderAds = (ads) => {
    return ads.map(ad => (
      <div key={ad.adId} className="flex p-4 bg-white shadow-md rounded mb-4">
        <div className="w-1/4 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4">
          <img src={ad.imagePath || 'https://via.placeholder.com/150'} alt={ad.adTitle} className="w-full h-full object-cover" />
        </div>
        <div className="w-3/4">
          <h3 className="text-lg font-bold">{ad.adTitle}</h3>
          <p className="text-gray-600">{ad.adDescription}</p>
          <p className="text-gray-600">{ad.adLocation}</p>
          <p className="text-gray-600">{ad.adCategory}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-6 mt-16">
      <div className="flex justify-center mb-6">
        <button onClick={() => setActiveTab('ACTIVE')} className={`px-4 py-2 ${activeTab === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}>
          <FaCheckCircle className="inline mr-2" /> Aktywne
        </button>
        <button onClick={() => setActiveTab('FINISHED')} className={`px-4 py-2 ${activeTab === 'FINISHED' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
          <FaTimesCircle className="inline mr-2" /> Zakończone
        </button>
      </div>
      <div>
        {activeTab === 'ACTIVE' ? renderAds(ads.ACTIVE) : renderAds(ads.FINISHED)}
      </div>
    </div>
  );
};

export default MyAdsPage;