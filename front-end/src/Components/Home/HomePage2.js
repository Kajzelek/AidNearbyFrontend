import React from 'react'
import HomePageStyle from './HomePageStyle.css'
import Designer from '../Assets/Designer.png'

const HomePage2 = () => {
  return (
        <div className="flex h-screen w-full">
        {/* Lewy panel */}
        <div className="w-1/5 bg-gray-100 p-4 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-40 h-40 bg-yellow-400 rounded-full mb-6 flex items-center justify-center">
            {/* Miejsce na zdjęcie */}
            <img
            src="link-do-zdjęcia"
            alt="Avatar"
            className="rounded-full object-cover w-full h-full"
            />
        </div>
        {/* Przyciski nawigacyjne */}
        <button className="bg-red-500 text-white w-full py-2 mb-2 rounded">Ustawienia</button>
        <button className="bg-red-500 text-white w-full py-2 mb-2 rounded">Historia ogłoszeń</button>
        <button className="bg-red-500 text-white w-full py-2 rounded">Inne</button>
        </div>

        {/* Główna sekcja */}
        <div className="w-4/5 bg-white p-8">
        {/* Logo */}
        <div className="bg-green-500 h-1/2 mb-6 flex items-center justify-center">
            {/* <h1 className="text-white text-xl font-bold">Logo</h1> */}
            <img src={Designer} alt="Logo" className="h-full object-contain" />
        </div>

        {/* Przyciski akcji */}
        <div className="border border-gray-400 bg-transparent p-8 flex justify-around rounded-lg">
            <button className="bg-orange-500 text-white py-4 px-8 rounded">Dodaj ogłoszenie</button>
            <button className="bg-purple-500 text-white py-4 px-8 rounded">Przeglądaj ogłoszenia</button>
        </div>
        </div>
    </div>
  )
}

export default HomePage2
