import React, { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaCheck, FaTimes, FaStar, FaEdit, FaTrash } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const MyAdDetailsProvide = () => {

  const navigate = useNavigate();
  const { adId } = useParams()
  const [adDetails, setAdDetails] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    adTitle: '',
    adCategory: '',
    adDescription: '',
    adLocation: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchAdDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`http://localhost:8080/api/ads/${adId}`, {
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
        setAdDetails(data)
        setEditFormData({
          adTitle: data.adTitle,
          adCategory: data.adCategory,
          adDescription: data.adDescription,
          adLocation: data.adLocation,
          imageUrl: data.imageUrl
        });
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

  


    const fetchApplicants = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`http://localhost:8080/api/adApplications/${adId}`, {
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
        setApplicants(data)
      } catch (error) {
        setError(error)
      }
    }

    fetchAdDetails()
    fetchApplicants()
  }, [adId])

  const fetchReviews = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/getReviews?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchProfileData = async (userId) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/getProfile?userId=${userId}`, {
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
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const updateApplicationStatus = async (applicantId, status) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/adApplications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ adApplicationId: applicantId, application_status: status })
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const updatedApplicant = await response.json()
      console.log(updatedApplicant)
      setApplicants(applicants.map(applicant => 
        applicant.applicantId === updatedApplicant.adApplicationId ? updatedApplicant : applicant
      ))
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const openModal = (applicant) => {
    setSelectedApplicant(applicant)
    fetchProfileData(applicant.applicantId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedApplicant(null)
    setProfileData(null)
  }

  const openReviewsModal = (userId) => {
    fetchReviews(userId)
    setIsReviewsModalOpen(true)
  }

  const closeReviewsModal = () => {
    setIsReviewsModalOpen(false)
    setReviews([])
  }

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/ads/${adId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedAd = await response.json();
      setAdDetails(updatedAd);
      closeEditModal();
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  const handleDeleteAd = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/ads?adId=${adId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      navigate('/my-ads');
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  if (!adDetails) {
    return <p>Ogłoszenie nie zostało znalezione</p>
  }

  return (
    <div className="p-6 mt-16 max-w-4xl mx-auto">
      <div className="text-center">
        <img src={adDetails.imageUrl || "https://via.placeholder.com/800x400"} alt="Ad" className="max-w-full h-auto mx-auto" />
      </div>
      <h1 className="text-center text-2xl font-bold mt-4">{adDetails.adTitle}</h1>
      <p className="mt-2"><strong>Help Type:</strong> {adDetails.helpType}</p>
      <p className="mt-2"><strong>Category:</strong> {adDetails.adCategory}</p>
      <p className="mt-2"><strong>Description:</strong> {adDetails.adDescription}</p>
      <p className="mt-2"><strong>Location:</strong> {adDetails.adLocation}</p>

      <div className="flex justify-end mt-4 space-x-2">
        <button 
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
          onClick={openEditModal}
        >
          <FaEdit className="inline mr-1" /> Edit
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          onClick={openDeleteModal}
        >
          <FaTrash className="inline mr-1" /> Delete
        </button>
      </div>

      <hr className="my-6 border-t-2 border-gray-300" />
      
      <h2 className="text-xl font-semibold mt-6 ">Applicants</h2>
      <ul className="list-none p-0  mt-4">
        {applicants.map(applicant => (
          <li key={applicant.applicantId} className="border border-gray-300 p-4 mb-4 rounded-lg">
            <p className="font-bold">{applicant.userMessage}</p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {applicant.application_status}</p>
            <p className="text-gray-700 mb-2"><strong>Created At:</strong> {new Date(applicant.createdAt).toLocaleDateString()}</p>
            <div className="mt-2 space-x-2">
              {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"><FaUser className="inline mr-1" /> See Profile</button> */}
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                onClick={() => openModal(applicant)}
              >
                <FaUser className="inline mr-1" /> See Profile
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"><FaEnvelope className="inline mr-1" /> Send Message</button>


              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                onClick={() => updateApplicationStatus(applicant.adApplicationId, 'ACCEPTED')}
              >
                <FaCheck className="inline mr-1" /> Make a help
              </button>

              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                onClick={() => updateApplicationStatus(applicant.adApplicationId, 'REJECTED')}
              >
                <FaTimes className="inline mr-1" /> Reject a help
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && profileData && (
        <div className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile Information</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
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
            
            <hr className="my-4 border-t-2 border-gray-300" />

            <button 
              onClick={() => openReviewsModal(selectedApplicant.userId)} 
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Show Reviews
            </button>

          </div>
        </div>
      )}


      {isReviewsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Reviews</h2>
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
                  <p className="font-bold">{review.userName}</p>
                  <p className="text-gray-700 mb-2">{review.text}</p>
                  <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

{isEditModalOpen && (
        <div className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Ad</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input 
                  type="text" 
                  name="adTitle" 
                  value={editFormData.adTitle} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input 
                  type="text" 
                  name="adCategory" 
                  value={editFormData.adCategory} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea 
                  name="adDescription" 
                  value={editFormData.adDescription} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input 
                  type="text" 
                  name="adLocation" 
                  value={editFormData.adLocation} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image URL</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  value={editFormData.imageUrl} 
                  onChange={handleEditChange} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="submit" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Deletion</h2>
              <button onClick={closeDeleteModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <p>Are you sure you want to delete this ad?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                onClick={handleDeleteAd} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
              <button 
                onClick={closeDeleteModal} 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default MyAdDetailsProvide