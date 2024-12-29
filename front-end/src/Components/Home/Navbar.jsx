import React, { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlineMenuAlt4 } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom'; // Jeśli korzystasz z React Router
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate()

  const handleNav = () => setNav(!nav);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    // Wylogowanie użytkownika
    localStorage.removeItem('token')
    // Wyświetlenie toast
    toast.success('Zostałeś wylogowany!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    // Przekierowanie na stronę logowania
    navigate('/login', { replace: true })
  }
  


  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          AID NEARBY
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-blue-600 transition">
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/ads" className="hover:text-blue-600 transition">
              Ads
            </Link>
          </li>
          <li>
            <Link to="/history" className="hover:text-blue-600 transition">
              My History
            </Link>
          </li>
          <li>
            <Link to="/help" className="hover:text-blue-600 transition">
              Help
            </Link>
          </li>
        </ul>

        {/* Profile Icon */}
        <div className="relative hidden md:block">

        
  <BsPerson
    size={24}
    className="text-gray-700 cursor-pointer"
    onClick={() => setShowProfileMenu((prev) => !prev)}
  />
  {showProfileMenu && (
    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 transform -translate-x-1/2 left-1/2 sm:left-auto sm:right-0 sm:translate-x-0">
      <ul className="flex flex-col text-gray-700 text-sm">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <Link to="/profile">My Profile</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <Link to="/settings">Settings</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <button
            // onClick={() => {
            //   localStorage.removeItem('token'); // Wylogowanie
            //   window.location.reload(); // Odświeżenie strony
        
            // }}
            onClick={handleLogout} 
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )}
</div>

        {/* Hamburger Icon */}
        <div className="md:hidden" onClick={handleNav}>
          {nav ? (
            <AiOutlineClose size={24} className="text-gray-700" />
          ) : (
            <HiOutlineMenuAlt4 size={24} className="text-gray-700" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          nav ? 'block' : 'hidden'
        } bg-gray-50 border-t border-gray-200 md:hidden absolute w-full`}
      >
        <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-medium">
          <li>
            <Link to="/" onClick={handleNav} className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={handleNav} className="hover:text-blue-600 transition">
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/ads" onClick={handleNav} className="hover:text-blue-600 transition">
              Ads
            </Link>
          </li>
          <li>
            <Link to="/history" onClick={handleNav} className="hover:text-blue-600 transition">
              My History
            </Link>
          </li>
          
          <li>
            <Link to="/help" onClick={handleNav} className="hover:text-blue-600 transition">
              Help
            </Link>
          </li>
        </ul>

        <div className="border-t border-gray-200 px-6 py-4 flex flex-col space-y-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Account
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
