import React, { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import ReviewModal from '../modals/ReviewModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('ROZPATRYWANE');
    const [applications, setApplications] = useState({ ROZPATRYWANE: [], ZAAKCEPTOWANE: [], ODRZUCONE: [], FINISHED: [] });
    const [adData, setAdData] = useState(null);
    const [adDetails, setAdDetails] = useState({});

    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [finishedView, setFinishedView] = useState('PROVIDE');

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [currentApplicationId, setCurrentApplicationId] = useState(null);
    const [reviewedApplications, setReviewedApplications] = useState([]); // Przechowuje ID zgłoszeń z opinią
    const [applicationReviews, setApplicationReviews] = useState({});



    useEffect(() => {
        const fetchApplications = async (status) => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:8080/api/adApplications?status=${status}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setApplications(prevState => ({ ...prevState, [status]: data }));
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications('ROZPATRYWANE');
        fetchApplications('ACCEPTED');
        fetchApplications('REJECTED');
        fetchApplications('FINISHED');
    }, []);


    const filterFinishedApplications = async (helpType) => {
        setLoading(true);
        const finishedApps = applications.FINISHED; // Pobieranie zgłoszeń zakończonych
        const filtered = [];

        for (const app of finishedApps) {
            try {
                const adDetails = await fetchAdById(app.adId); // Pobierz szczegóły ogłoszenia
                if (adDetails?.helpType === helpType) {
                    filtered.push(app);
                }
            } catch (error) {
                console.error(`Error processing application with adId=${app.adId}`, error);
            }
        }

        setFilteredApplications(filtered); // Zapisz przefiltrowane zgłoszenia
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'FINISHED') {
            filterFinishedApplications(finishedView);
        }
    }, [activeTab, finishedView]);

    const handleAddReview = (applicationId) => {
        setCurrentApplicationId(applicationId);
        setReviewModalOpen(true);
    };

    const handleSubmitReview = async ({ rating, comment }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/review/createReview?adApplicationId=${currentApplicationId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (response.ok) {
                const review = await response.json();
                setReviewedApplications([...reviewedApplications, currentApplicationId]);
                //alert("Opinia została wysłana!");
                toast.success("Opinia została wysłana!");
            } else {
                //alert("Wystąpił błąd podczas wysyłania opinii.");
                toast.error("Wystąpił błąd podczas wysyłania opinii.");
            }
        } catch (error) {
            console.error("Error sending review:", error);
            alert("Nie udało się wysłać opinii.");
        }

        setReviewModalOpen(false);
        setCurrentApplicationId(null);
    };

    
    const renderApplications = (data) => {
        return data.map(app => (
            <div key={app.adApplicationId} className="p-4 bg-white shadow-md rounded mb-4 flex">
                <div className="w-1/16">
                    <img src="https://via.placeholder.com/150" alt="Ad" className="w-full h-auto rounded" />
                </div>
                <div className="w-3/4 pl-4">
                    <h3 className="text-lg font-bold">{app.adTitle}</h3>
                    <p className="text-gray-600">
                        <span className="font-semibold">Data zgłoszenia:</span> {new Date(app.createdAt).toLocaleDateString()} <br />
                        <span className="font-semibold">Godzina zgłoszenia:</span> {new Date(app.createdAt).toLocaleTimeString()}
                    </p>
                    <hr className="mt-4" />
                    <p className="text-gray-700 mt-2">{app.userMessage}</p>
                    <p className={`text-sm mt-2 ${app.application_status === 'ACCEPTED' ? 'text-green-500' : app.application_status === 'REJECTED' ? 'text-red-500' : app.application_status === 'FINISHED' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {app.application_status}
                    </p>

                    {finishedView === 'PROVIDE' && activeTab === 'FINISHED' && (
                    <button
                        onClick={() => handleAddReview(app.adApplicationId)}
                        className={`mt-4 px-4 py-2 rounded shadow ${
                            reviewedApplications.includes(app.adApplicationId)
                                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        disabled={reviewedApplications.includes(app.adApplicationId)}
                    >
                        {reviewedApplications.includes(app.adApplicationId) ? 'Wysłano opinię' : 'Wystaw opinię'}
                    </button>
                    )}
                </div>
            </div>
        ));
    };

      const fetchAdById = async (adId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/ads/${adId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            return data;
            setAdData(data);
        } catch (error) {
            console.error('Error fetching ad by ID:', error);
        }
    };
    

    useEffect(() => {
        const fetchReviewedApplications = async (applications) => {
            const token = localStorage.getItem("token");
            const reviewed = [];
    
            for (const app of applications) {
                try {
                    const response = await fetch(`http://localhost:8080/api/review/checkIfUserReviewed?adApplicationId=${app.adApplicationId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const isReviewed = await response.json();
                    if (isReviewed) {
                        reviewed.push(app.adApplicationId); // Dodaj do listy zablokowanych
                    }
                } catch (error) {
                    console.error(`Error checking review status for adApplicationId=${app.adApplicationId}`, error);
                }
            }
    
            setReviewedApplications(reviewed); // Ustaw aplikacje z recenzjami
        };
    
        if (activeTab === 'FINISHED') {
            filterFinishedApplications(finishedView).then(() => {
                fetchReviewedApplications(applications.FINISHED);
            });
        }
    }, [activeTab, finishedView]);
    

    return (
        <div className="container mx-auto p-6 mt-16"> {/* Dodaj margines górny */}
        <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Moje zgłoszenia</h1>
            
            <div className="flex justify-center mb-6">

                <button onClick={() => setActiveTab('ROZPATRYWANE')} className={`px-4 py-2 ${activeTab === 'ROZPATRYWANE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}>
                    <FaClock className="inline mr-2" /> OCZEKUJĄCE
                </button>

                <button onClick={() => setActiveTab('ACCEPTED')} className={`px-4 py-2 ${activeTab === 'ACCEPTED' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    <FaCheck className="inline mr-2" /> ZAAKCEPTOWANE
                </button>

                <button onClick={() => setActiveTab('REJECTED')} className={`px-4 py-2 ${activeTab === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
                    <FaTimes className="inline mr-2" /> ODRZUCONE
                </button>

                <button onClick={() => setActiveTab('FINISHED')} className={`px-4 py-2 ${activeTab === 'FINISHED' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
                    <FaTimes className="inline mr-2" /> ZAKOŃCZONE
                </button>

            </div>

            {activeTab === 'FINISHED' && (
                <div className="flex justify-center mb-6">
                    <button onClick={() => setFinishedView('PROVIDE')} className={`px-4 py-2 ${finishedView === 'PROVIDE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}>
                        PROVIDE
                    </button>
                    <button onClick={() => setFinishedView('LOOKING_FOR')} className={`px-4 py-2 ${finishedView === 'LOOKING_FOR' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
                        LOOKING FOR
                    </button>
                </div>
            )}

            <div>
                {loading ? (
                    <p>Ładowanie...</p>
                ) : activeTab === 'FINISHED' ? (
                    <div>
                        {renderApplications(filteredApplications)}
                        <ReviewModal
                            isOpen={reviewModalOpen}
                            onClose={() => setReviewModalOpen(false)}
                            adApplicationId={currentApplicationId}
                            onSubmit={handleSubmitReview}
                        />
                    </div>
                ) : (
                    renderApplications(applications[activeTab])
                )}
            </div>
            

            {/* <div>
                {renderApplications(activeTab)}
            </div> */}
        </div>
    );
};

export default MyApplicationsPage;