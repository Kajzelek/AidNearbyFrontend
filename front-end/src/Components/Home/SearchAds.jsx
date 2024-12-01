import React, { useState } from "react";

const SearchAds = () => {
  const [category, setCategory] = useState("Elektronika");
  const [radius, setRadius] = useState(5);
  const [ads, setAds] = useState([]);
  
  const userLatitude = 52.2297; // Współrzędne użytkownika
  const userLongitude = 21.0122;

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ads/search?category=${category}&latitude=${userLatitude}&longitude=${userLongitude}&radius=${radius}`
      );
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Błąd podczas wyszukiwania ogłoszeń:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Wyszukaj Ogłoszenia</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Kategoria:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Elektronika">Elektronika</option>
          <option value="Ubrania">Ubrania</option>
          <option value="Meble">Meble</option>
          {/* Dodaj więcej kategorii */}
        </select>
      </div>

      <div className="mb-4">
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Szukaj
      </button>

      <div className="mt-6">
        {ads.length > 0 ? (
          <ul>
            {ads.map((ad, index) => (
              <li
                key={index}
                className="border p-4 mb-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => window.location.href = `/ads/${ad.id}`}
              >
                <h2 className="font-bold">{ad.adTitle}</h2>
                <p>{ad.adDescription}</p>
                <span className="text-sm text-gray-500">{ad.adLocation}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak wyników wyszukiwania</p>
        )}
      </div>
    </div>
  );
};

export default SearchAds;
