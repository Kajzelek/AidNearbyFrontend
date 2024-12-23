import React, { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaCheck, FaTimes, FaStar } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

const MyAdDetailsProvide = () => {

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
    <div className="p-6  mt-16 max-w-4xl mx-auto">
      <div className="text-center">
        <img src={adDetails.imageUrl || "https://via.placeholder.com/800x400"} alt="Ad" className="max-w-full h-auto mx-auto" />
      </div>
      <h1 className="text-center text-2xl font-bold mt-4">{adDetails.adTitle}</h1>
      <p className="mt-2"><strong>Help Type:</strong> {adDetails.helpType}</p>
      <p className="mt-2"><strong>Category:</strong> {adDetails.adCategory}</p>
      <p className="mt-2"><strong>Description:</strong> {adDetails.adDescription}</p>
      <p className="mt-2"><strong>Location:</strong> {adDetails.adLocation}</p>

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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

            <button 
              onClick={closeModal} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Close
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


    </div>
  )
}

export default MyAdDetailsProvide