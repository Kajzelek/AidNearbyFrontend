import React, { useState, useEffect } from 'react';
import { BsPerson, BsBell } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlineMenuAlt4 } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom'; // Jeśli korzystasz z React Router
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate()

  const handleNav = () => setNav(!nav);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

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
  
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('http://localhost:8080/api/notifications/getNotifications', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/notifications/deleteNotification/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      // Aktualizacja stanu notifications, aby usunięte powiadomienie natychmiast zniknęło z widoku
      setNotifications(notifications.filter(notification => notification.notificationId !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error deleting notification');
    }
  };

  const handleDeleteAllNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch('http://localhost:8080/api/notifications/deleteAllNotifications', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setNotifications([]);
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Error deleting all notifications');
    }
  };



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
          {/* <li>
            <Link to="/profile" className="hover:text-blue-600 transition">
              My Profile
            </Link>
          </li> */}
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
            <Link to="/chat" className="hover:text-blue-600 transition">
              Chat
            </Link>
          </li>
        </ul>

        {/* Profile Icon */}
        <div className="relative hidden md:block">
        
        <div className="relative hidden md:flex items-center space-x-4">

        <BsBell
            size={24}
            className="text-gray-700 cursor-pointer"
            onClick={toggleNotifications}
          />
          {showNotifications && (
            <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-10 transform -translate-x-1/2 left-1/2 sm:left-auto sm:right-0 sm:translate-x-0">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Notifications</h3>
                {notifications.length > 0 ? (
                  <ul className="text-gray-700 text-sm">
                    {notifications.map(notification => (
                      <li 
                        key={notification.notificationId}
                        className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setTimeout(() => {
                            navigate(`/ads/${notification.adId}`);
                          }, 0);
                        }}
                        >
                        <div>
                          <p>
                          {notification.notificationType === 'NEW_AD' ? 'Nowe ogłoszenie w okolicy!' :
                             notification.notificationType === 'NEW_APPLICATION' ? 'Nowa aplikacja w twoim ogłoszeniu!' :
                             notification.notificationType === 'NEW_MESSAGE' ? 'Masz nową wiadomość!' :
                             'Nieznany typ powiadomienia'}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.notificationId)
                        }} 
                        className="text-red-500 hover:text-red-700">
                          <AiOutlineClose size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No notifications</p>
                )}
                {notifications.length > 0 && (
                  <button onClick={handleDeleteAllNotifications} className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}

        
  <BsPerson
    size={24}
    className="text-gray-700 cursor-pointer"
    onClick={() => setShowProfileMenu((prev) => !prev)}
  />
  {showProfileMenu && (
    <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 transform -translate-x-1/2 left-1/2 sm:left-auto sm:right-0 sm:translate-x-0">
      <ul className="flex flex-col text-gray-700 text-sm">
        
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
</div>

        {/* Hamburger Icon */}
        {/* <div className="md:hidden" onClick={handleNav}>
          {nav ? (
            <AiOutlineClose size={24} className="text-gray-700" />
          ) : (
            <HiOutlineMenuAlt4 size={24} className="text-gray-700" />
          )}
        </div>
      </div> */}

      <div className="md:hidden flex items-center space-x-4">
          <BsBell
            size={24}
            className="text-gray-700 cursor-pointer"
            onClick={toggleNotifications}
          />
          {showNotifications && (
            <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-10 transform -translate-x-1/2 left-1/2 sm:left-auto sm:right-0 sm:translate-x-0">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Notifications</h3>
                {notifications.length > 0 ? (
                  <ul className="text-gray-700 text-sm">
                    {notifications.map(notification => (
                      <li key={notification.notificationId} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <div>
                          <p>
                          {notification.notificationType === 'NEW_AD' ? 'Nowe ogłoszenie w okolicy!' :
                             notification.notificationType === 'NEW_APPLICATION' ? 'Nowa aplikacja w twoim ogłoszeniu!' :
                             notification.notificationType === 'NEW_MESSAGE' ? 'Masz nową wiadomość!' :
                             'Nieznany typ powiadomienia'}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleDeleteNotification(notification.notificationId)} className="text-red-500 hover:text-red-700">
                          <AiOutlineClose size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No notifications</p>
                )}
                {notifications.length > 0 && (
                  <button onClick={handleDeleteAllNotifications} className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
          <div onClick={handleNav}>
            {nav ? (
              <AiOutlineClose size={24} className="text-gray-700" />
            ) : (
              <HiOutlineMenuAlt4 size={24} className="text-gray-700" />
            )}
          </div>
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
            <Link to="/chat" onClick={handleNav} className="hover:text-blue-600 transition">
              Chat
            </Link>
          </li>
        </ul>

        <div className="border-t border-gray-200 px-6 py-4 flex flex-col space-y-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
