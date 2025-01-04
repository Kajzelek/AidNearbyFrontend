import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyAdsPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [ads, setAds] = useState({ ACTIVE: [], INACTIVE: [] });
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();


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
    fetchAds('INACTIVE');
  }, []);

  const handleAdClick = (adId) => {
    navigate(`/ad-details/${adId}`);
  };

  const renderAds = (ads) => {
    const filteredAds = ads.filter(ad => filter === 'ALL' || ad.helpType === filter);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);

    return currentAds.map(ad => (
      <div
        key={ad.adId} 
        className={`flex items-center p-4 mb-4 border-2 rounded-lg cursor-pointer ${
        ad.helpType === 'PROVIDE' ? 'border-green-500 hover:border-green-700 hover:border-4' : 'border-blue-500 hover:border-blue-700 hover:border-4'
        }`}
        onClick={() => handleAdClick(ad.adId)}
      >

        <div className="w-1/4 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4">
          <img src={ad.imagePath || 'https://via.placeholder.com/150'} alt={ad.adTitle} className="w-full h-full object-cover" />
        </div>

        <div className="w-3/4">
          <h3 className="text-lg font-bold">{ad.adTitle}</h3>
          <p className="text-gray-600">{ad.adDescription}</p>
          <p className="text-gray-600">{ad.adLocation}</p>
          <p className="text-gray-600">{ad.adCategory}</p>
          <p className={`text-sm font-semibold ${ad.helpType === 'PROVIDE' ? 'text-green-500' : 'text-blue-500'}`}>
            {ad.helpType === 'PROVIDE' ? 'Udzielam pomocy' : 'Szukam pomocy'}
          </p>
        </div>

      </div>
    ));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
<div className="container mx-auto p-6 mt-16">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 ${activeTab === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}
        >
          <FaCheckCircle className="inline mr-2" /> Aktywne
        </button>
        <button
          onClick={() => setActiveTab('INACTIVE')}
          className={`px-4 py-2 ${activeTab === 'INACTIVE' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}
        >
          <FaTimesCircle className="inline mr-2" /> Zakończone
        </button>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 ${filter === 'ALL' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setFilter('PROVIDE')}
          className={`px-4 py-2 ${filter === 'PROVIDE' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Udzielam pomocy
        </button>
        <button
          onClick={() => setFilter('LOOKING_FOR')}
          className={`px-4 py-2 ${filter === 'LOOKING_FOR' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}
        >
          Szukam pomocy
        </button>
      </div>
      <div>{activeTab === 'ACTIVE' ? renderAds(ads.ACTIVE) : renderAds(ads.INACTIVE)}</div>

      <div className="mt-6 flex justify-center">
        {Array.from({ length: Math.ceil((filter === 'ALL' ? ads[activeTab].length : ads[activeTab].filter(ad => ad.helpType === filter).length) / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

    </div>

  );
};

export default MyAdsPage;