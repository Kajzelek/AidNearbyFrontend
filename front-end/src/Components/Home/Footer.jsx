import React from "react";
import { FaUsers, FaClipboardList, FaCheckCircle, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Aid Nearby</h3>
          <p className="text-sm">
            Aplikacja wspierająca sąsiedzką pomoc. Oferuj wsparcie i znajdź pomoc w Twojej okolicy.
          </p>
        </div>
        <div className="text-center">
          <div className="mb-4">
            <FaUsers size={24} className="mx-auto mb-2 text-blue-400" />
            <p className="text-sm">Użytkownicy: <span className="font-bold text-white">12,345</span></p>
          </div>
          <div className="mb-4">
            <FaClipboardList size={24} className="mx-auto mb-2 text-green-400" />
            <p className="text-sm">Ogłoszenia: <span className="font-bold text-white">678</span></p>
          </div>
          <div>
            <FaCheckCircle size={24} className="mx-auto mb-2 text-yellow-400" />
            <p className="text-sm">Zakończone zadania: <span className="font-bold text-white">789</span></p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Nawigacja</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline hover:text-white">O nas</a></li>
            <li><a href="/contact" className="hover:underline hover:text-white">Kontakt</a></li>
            <li><a href="/help" className="hover:underline hover:text-white">Pomoc</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Śledź nas</h3>
          <div className="flex space-x-4">
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
      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Aid Nearby. Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
};

export default Footer;