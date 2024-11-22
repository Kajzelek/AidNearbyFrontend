import React from "react";
import { FaSearch, FaPlusCircle, FaStar } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          O aplikacji Aid Nearby
        </h2>
        <p className="text-gray-600 mb-10">
          Aid Nearby to platforma, która ułatwia niesienie pomocy sąsiadom, a także znajdowanie wsparcia w Twojej okolicy. Dołącz do społeczności wspierającej się na co dzień!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <FaSearch size={40} className="text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Wyszukiwanie ogłoszeń
            </h3>
            <p className="text-gray-600">
              Znajdź pomoc w swojej okolicy dzięki intuicyjnemu systemowi wyszukiwania.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <FaPlusCircle size={40} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Dodawanie ogłoszeń
            </h3>
            <p className="text-gray-600">
              Opublikuj swoje potrzeby lub zaoferuj pomoc w zaledwie kilku krokach.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <FaStar size={40} className="text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Oceny użytkowników
            </h3>
            <p className="text-gray-600">
              Buduj zaufanie w społeczności dzięki systemowi ocen i opinii.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
