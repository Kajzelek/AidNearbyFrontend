import React, { useEffect, useRef, useState } from 'react';

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    let clickListener;

    if (isOpen && mapRef.current && !map) {
      // Inicjalizacja mapy
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 52.2297, lng: 21.0122 }, // Domyślna lokalizacja: Warszawa
        zoom: 8,
      });
      setMap(googleMap);

      // Listener do obsługi kliknięcia
      clickListener = googleMap.addListener('click', (e) => {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        // Dodanie lub aktualizacja markera
        if (!marker) {
          const newMarker = new window.google.maps.Marker({
            position: location,
            map: googleMap,
          });
          setMarker(newMarker);
        } else {
          marker.setPosition(location);
        }
      });
    }

    // Cleanup przy zamknięciu mapy
    return () => {
      if (clickListener) {
        window.google.maps.event.removeListener(clickListener);
      }
      setMarker(null); // Resetowanie markera
      setMap(null); // Resetowanie mapy
    };
  }, [isOpen, map, marker]);

  const handleSaveLocation = () => {
    if (marker) {
      const position = marker.getPosition();
      onLocationSelect({ lat: position.lat(), lng: position.lng() });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
        {/* Ikona zamykania */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg z-50"
          aria-label="Close map"
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-lg font-semibold mb-4">Select Location on Map</h2>
        <div
          ref={mapRef}
          style={{ height: '400px', width: '100%' }}
          className="mb-4 border relative"
        ></div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLocation}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
