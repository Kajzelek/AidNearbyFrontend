import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaUser, FaEnvelope, FaStar, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdDetails = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openProfileModal = async () => {
    const token = localStorage.getItem("token");
    // Fetch profile data
    const response = await fetch(`http://localhost:8080/getProfile?userId=${ad.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      //body: JSON.stringify(adApplicationDTO)
    });
    const data = await response.json();
    setProfileData(data);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setProfileData(null);
  };

  const openApplicationModal = () => {
    setIsApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setUserMessage('');
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const adApplicationDTO = {
      userMessage,
      adId: ad.adId
    };

    const response = await fetch('http://localhost:8080/api/adApplications/createAdApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adApplicationDTO)
    });

    if (response.ok) {
      closeApplicationModal();
      toast.success('Zgłoszenie zostało wysłane!')
    } else {
      console.error('Error submitting application');
      toast.error('Wystąpił błąd podczas wysyłania zgłoszenia.')
    }
  };

  useEffect(() => {
    const fetchAdDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/ads/${adId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAd(data);
        console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdDetails();
    CheckIfApplied()
  }, [adId]);

  const CheckIfApplied = async () => {
    const token = localStorage.getItem("token");
    try {
     const response = await fetch(`http://localhost:8080/api/adApplications/hasUserApplied?adId=${adId}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const ifApplied = await response.json();
      setHasApplied(ifApplied);
    } catch (error) {
      setError(error);
    }
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/review/getReviewsByUserId?userId=${ad.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setReviews(data)
      setIsReviewsModalOpen(true)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false)
    setReviews([])
  }

  const handleConversation = async (secondUserId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8080/conversations/checkIfConversationExists?user2Id=${secondUserId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        

        if (data) {
            navigate('/chat');
        } else {
            const newConversationResponse = await fetch('http://localhost:8080/conversations/createConversation', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    user2: secondUserId,
                 }),
            });

            if (newConversationResponse.status === 201) {
                navigate('/chat');
                console.log(secondUserId);
            } else {
                throw new Error('Failed to create new conversation');
            }
        }
    } catch (error) {
        console.error('Błąd podczas obsługi konwersacji:', error);
    }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!ad) {
    return <p>Ogłoszenie nie zostało znalezione</p>;
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {/* Miejsce na zdjęcie */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 md:mb-0">
              {/* Placeholder na zdjęcie */}
              <img src={ad.imagePath || 'https://via.placeholder.com/300'} alt={ad.adTitle} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h2 className="font-bold text-2xl mb-4">{ad.adTitle}</h2>
            <p className="text-gray-700 mb-2">{ad.adDescription}</p>
            <p className="text-gray-700 mb-2"><strong>Kategoria:</strong> {ad.adCategory}</p>
            {ad.adLocation && <p className="text-gray-700 mb-2"><strong>Lokalizacja:</strong> {ad.adLocation}</p>}
            {/* Dodaj inne szczegóły ogłoszenia tutaj */}
            <div className="mt-6 flex space-x-4">

              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                onClick={() => handleConversation(ad.userId)}
              >
                Napisz wiadomość
              </button>

              <button 
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ${hasApplied ? 'cursor-not-allowed' : ''}"`} 
                onClick={openApplicationModal}
                disabled={hasApplied}
                >
                  {hasApplied ? 'Zgłoszono' : 'Zgłoś się'}
              </button>
            </div>

            <div className="mt-6 flex space-x-4">
        
              <button 
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
              onClick={fetchReviews}
              >
                  Pokaż opinie
              </button>

              <button
               className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
               onClick={openProfileModal}>
                Pokaż profil
              </button>
            </div>
          </div>
        </div>

        {isReviewsModalOpen && (
        <div className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Opinie użytkowników</h2>
              <button onClick={closeReviewsModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <ul className="list-none p-0">
              {reviews.map(review => (
                <li key={review.id} className="border border-gray-300 p-4 mb-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`mr-1 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  {/* <p className="font-bold">{review.userName}</p> */}
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

        <ToastContainer />
      </div>


      {isProfileModalOpen && profileData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile Information</h2>

              <button onClick={closeProfileModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <img src={profileData.profilePicture || "https://via.placeholder.com/150"} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
            <p><strong>Name:</strong> {profileData.firstName} {profileData.lastName}</p>
            <p><strong>Age:</strong> {profileData.age}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Phone:</strong> {profileData.phoneNumber}</p>
            <p><strong>Address:</strong> {profileData.address}</p>
            <p><strong>Bio:</strong> {profileData.bio}</p>
          </div>
        </div>
      )}

      {isApplicationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Zgłoszenie</h2>
              <button onClick={closeApplicationModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleApplicationSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Wiadomość</label>
                <textarea 
                  name="userMessage" 
                  value={userMessage} 
                  onChange={(e) => setUserMessage(e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="submit" 
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mt-4 `}
                >
                  Wyślij
                </button>
                <button 
                  type="button" 
                  onClick={closeApplicationModal} 
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdDetails;