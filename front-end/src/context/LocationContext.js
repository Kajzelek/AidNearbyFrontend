import React, { createContext, useContext, useState } from 'react';

// Tworzenie kontekstu
const LocationContext = createContext();

// Hook do łatwego użycia kontekstu
export const useLocationContext = () => {
    return useContext(LocationContext);
};

// Provider do opakowania aplikacji
export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
