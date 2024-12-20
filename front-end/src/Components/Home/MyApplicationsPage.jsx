import React, { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const MyApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('ROZPATRYWANE');
    const [applications, setApplications] = useState({ ROZPATRYWANE: [], ZAAKCEPTOWANE: [], ODRZUCONE: [] });

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
                console.log(data);
                setApplications(prevState => ({ ...prevState, [status]: data }));
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications('ROZPATRYWANE');
        fetchApplications('ZAAKCEPTOWANE');
        fetchApplications('ODRZUCONE');
    }, []);

    useEffect(() => {
        console.log('Updated applications:', applications);
    }, [applications]);

    const renderApplications = (category) => {
        return applications[category].map(app => (
            <div key={app.adId} className="p-4 bg-white shadow-md rounded mb-4">
                <h3 className="text-lg font-bold">{app.adTitle}</h3>
                <p className="text-gray-600">{new Date(app.createdAt).toLocaleDateString()} | {new Date(app.createdAt).toLocaleTimeString()}</p>
                <p className={`text-sm ${app.status === 'ZAAKCEPTOWANE' ? 'text-green-500' : app.status === 'ODRZUCONE' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {app.status}
                </p>
            </div>
        ));
    };

    return (
        <div className="container mx-auto p-6 mt-16"> {/* Dodaj margines górny */}
            <div className="flex justify-center mb-6">
                <button onClick={() => setActiveTab('ROZPATRYWANE')} className={`px-4 py-2 ${activeTab === 'ROZPATRYWANE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}>
                    <FaClock className="inline mr-2" /> OCZEKUJĄCE
                </button>
                <button onClick={() => setActiveTab('ZAAKCEPTOWANE')} className={`px-4 py-2 ${activeTab === 'ZAAKCEPTOWANE' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    <FaCheck className="inline mr-2" /> ZAAKCEPTOWANE
                </button>
                <button onClick={() => setActiveTab('ODRZUCONE')} className={`px-4 py-2 ${activeTab === 'ODRZUCONE' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}>
                    <FaTimes className="inline mr-2" /> ODRZUCONE
                </button>
            </div>
            <div>
                {renderApplications(activeTab)}
            </div>
        </div>
    );
};

export default MyApplicationsPage;