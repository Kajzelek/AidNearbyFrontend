import React, { useState } from "react";
import { useLocationContext } from '../../context/LocationContext';
import { useNavigate } from 'react-router-dom';
import jwt_decode, { jwtDecode } from "jwt-decode";

const SearchAds = () => {
  const [category, setCategory] = useState("wszystkie");
  const [radius, setRadius] = useState(5);
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('ALL');
  const itemsPerPage = 10;
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userLatitude = decodedToken.latitude;
  const userLongitude = decodedToken.longitude;

  const handleAdClick = (adId) => {
    navigate(`/ads/${adId}`);
  };

  const handleSearch = async () => {

    if (category === "wszystkie") {
      handleSearchAnyCategory();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/ads/searchByStatus?category=${category}&latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&status=ACTIVE`,
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

  const handleSearchAnyCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ads/searchByStatus/anyCategory?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&status=ACTIVE`,
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


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1); // Return distance with one decimal place
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredAds = ads.filter(ad => filter === 'ALL' || ad.helpType === filter);
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentAds);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 mt-16 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Wyszukaj Ogłoszenia</h1>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Kategoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="wszystkie">Wszystkie</option>
            <option value="Elektronika">Elektronika</option>
            <option value="Ubrania">Ubrania</option>
            <option value="Meble">Meble</option>
            <option value="Services">Serwisy</option>
            <option value="Transport">Transport</option>
            <option value="Zakupy">Zakupy</option>
            <option value="Opieka nad dziećmi">Opieka nad dziećmi</option>
            <option value="Opieka nad zwierzętami">Opieka nad zwierzętami</option>
            <option value="Sprzątanie">Sprzątanie</option>
            <option value="Gotowanie">Gotowanie</option>
            <option value="Naprawy domowe">Naprawy domowe</option>
            <option value="Pomoc w nauce">Pomoc w nauce</option>
            <option value="Ogrodnictwo">Ogrodnictwo</option>
            <option value="Pomoc techniczna">Pomoc techniczna</option>
            <option value="Wsparcie emocjonalne">Wsparcie emocjonalne</option>
            <option value="Pomoc medyczna">Pomoc medyczna</option>
            <option value="Prace remontowe">Prace remontowe</option>
            <option value="Przeprowadzki">Przeprowadzki</option>
            <option value="Wypożyczanie narzędzi">Wypożyczanie narzędzi</option>
            <option value="Wypożyczanie sprzętu">Wypożyczanie sprzętu</option>
            <option value="Kursy i szkolenia">Kursy i szkolenia</option>
            <option value="Pomoc prawna">Pomoc prawna</option>
            <option value="Doradztwo finansowe">Doradztwo finansowe</option>
            <option value="Tłumaczenia">Tłumaczenia</option>
            <option value="Inne">Inne</option>
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
                  className={`flex items-center p-4 mb-4 border-2 rounded-lg cursor-pointer ${
                    ad.helpType === 'PROVIDE' ? 'border-green-500 hover:border-green-700 hover:border-4' : 'border-blue-500 hover:border-blue-700 hover:border-4'
                  }`}
                  onClick={() => handleAdClick(ad.adId)}
                >
                  <div className="w-1/4 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4">
                    <img src={ad.imagePath || 'https://via.placeholder.com/150'} alt={ad.adTitle} className="w-full h-full object-cover" />
                  </div>

                  <div className="w-3/4">
                    <h2 className="font-bold text-lg">{ad.adTitle}</h2>
                    <p className="font-bold text-gray-600">{ad.adCategory}</p>
                    <p className="text-gray-700">{ad.adDescription}</p>
                    <hr className="my-4" />
                    <p className="text-gray-600">{ad.adLocation}</p>
                    <p className={`text-sm font-semibold ${ad.helpType === 'PROVIDE' ? 'text-green-500' : 'text-blue-500'}`}>
                      {ad.helpType === 'PROVIDE' ? 'Udzielam pomocy' : 'Szukam pomocy'}
                    </p>
                    <span className="text-sm text-gray-500">
                      {calculateDistance(userLatitude, userLongitude, ad.latitude, ad.longitude)} km
                    </span>
                  </div>


                  {/* <h2 className="font-bold text-lg">{ad.adTitle}</h2>
                  <p className="text-gray-700">{ad.adDescription}</p>

                  <span className="text-sm text-gray-500">
                    {calculateDistance(userLatitude, userLongitude, ad.latitude, ad.longitude)} km
                  </span> */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Brak wyników wyszukiwania</p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {Array.from({ length: Math.ceil(filteredAds.length / itemsPerPage) }, (_, index) => (
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