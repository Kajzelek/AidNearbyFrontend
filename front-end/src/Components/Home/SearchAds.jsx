import React, { useState } from "react";
import { useLocationContext } from '../../context/LocationContext';
import { useNavigate } from 'react-router-dom';

const SearchAds = () => {
  const [category, setCategory] = useState("Elektronika");
  const [radius, setRadius] = useState(5);
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { location } = useLocationContext();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleAdClick = (adId) => {
    navigate(`/ads/${adId}`);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ads/search?category=${category}&latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAds(data);
      setCurrentPage(1); // Resetuj stronę do pierwszej po nowym wyszukiwaniu
    } catch (error) {
      console.error("Błąd podczas wyszukiwania ogłoszeń:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = ads.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentAds);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Wyszukaj Ogłoszenia</h1>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Kategoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Elektronika">Elektronika</option>
            <option value="Ubrania">Ubrania</option>
            <option value="Meble">Meble</option>
            {/* Dodaj więcej kategorii */}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Zasięg (km):</label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full"
          />
          <div className="text-center mt-2">{radius} km</div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Szukaj
        </button>

        <div className="mt-8">
          {currentAds.length > 0 ? (
            <ul>
              {currentAds.map((ad, index) => (

                <li
                  key={index}
                  className="border p-4 mb-4 rounded hover:bg-gray-100 cursor-pointer transition duration-300"
                  onClick={() => handleAdClick(ad.adId)}
                >
                  <h2 className="font-bold text-lg">{ad.adTitle}</h2>
                  <p className="text-gray-700">{ad.adDescription}</p>
                  <span className="text-sm text-gray-500">{ad.latitude}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Brak wyników wyszukiwania</p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {Array.from({ length: Math.ceil(ads.length / itemsPerPage) }, (_, index) => (
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
    </div>
  );
};

export default SearchAds;