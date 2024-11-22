// import React from "react";
// import { FaUsers, FaClipboardList, FaCheckCircle } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white py-8">
//       <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
//         <div>
//           <FaUsers size={32} className="mx-auto mb-2" />
//           <h3 className="text-lg font-bold">Użytkownicy</h3>
//           <p>12,345</p>
//         </div>
//         <div>
//           <FaClipboardList size={32} className="mx-auto mb-2" />
//           <h3 className="text-lg font-bold">Dostępne ogłoszenia</h3>
//           <p>678</p>
//         </div>
//         <div>
//           <FaCheckCircle size={32} className="mx-auto mb-2" />
//           <h3 className="text-lg font-bold">Zakończone zadania</h3>
//           <p>789</p>
//         </div>
//       </div>
//       <div className="text-center mt-8 text-sm text-gray-400">
//         © {new Date().getFullYear()} Aid Nearby. Wszystkie prawa zastrzeżone.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from "react";
import { FaUsers, FaClipboardList, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sekcja 1: O aplikacji */}
        <div>
          <h3 className="text-lg font-bold mb-4">Aid Nearby</h3>
          <p className="text-gray-400 text-sm">
            Aplikacja wspierająca sąsiedzką pomoc. Oferuj wsparcie i znajdź pomoc w Twojej okolicy.
          </p>
        </div>

        {/* Sekcja 2: Statystyki */}
        <div className="text-center">
          <div className="mb-4">
            <FaUsers size={24} className="mx-auto mb-2 text-blue-400" />
            <p className="text-sm text-gray-400">Użytkownicy: <span className="font-bold">12,345</span></p>
          </div>
          <div className="mb-4">
            <FaClipboardList size={24} className="mx-auto mb-2 text-green-400" />
            <p className="text-sm text-gray-400">Ogłoszenia: <span className="font-bold">678</span></p>
          </div>
          <div>
            <FaCheckCircle size={24} className="mx-auto mb-2 text-yellow-400" />
            <p className="text-sm text-gray-400">Zakończone zadania: <span className="font-bold">789</span></p>
          </div>
        </div>

        {/* Sekcja 3: Nawigacja */}
        <div>
          <h3 className="text-lg font-bold mb-4">Nawigacja</h3>
          <ul className="text-gray-400 space-y-2">
            <li><a href="/about" className="hover:underline">O nas</a></li>
            <li><a href="/contact" className="hover:underline">Kontakt</a></li>
            <li><a href="/help" className="hover:underline">Pomoc</a></li>
          </ul>
        </div>

        {/* Sekcja 4: Media społecznościowe */}
        <div>
          <h3 className="text-lg font-bold mb-4">Śledź nas</h3>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Aid Nearby. Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
};

export default Footer;
