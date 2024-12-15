import React, { useState } from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const MyApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('pending');

    const applications = {
        pending: [
            { id: 1, title: 'Pending Application 1', date: '2023-10-01', status: 'Pending' },
            { id: 2, title: 'Pending Application 2', date: '2023-10-02', status: 'Pending' },
        ],
        accepted: [
            { id: 3, title: 'Accepted Application 1', date: '2023-09-25', status: 'Accepted' },
            { id: 4, title: 'Accepted Application 2', date: '2023-09-26', status: 'Accepted' },
        ],
        rejected: [
            { id: 5, title: 'Rejected Application 1', date: '2023-09-20', status: 'Rejected' },
            { id: 6, title: 'Rejected Application 2', date: '2023-09-21', status: 'Rejected' },
        ],
    };

    const renderApplications = (category) => {
        return applications[category].map(app => (
            <div key={app.id} className="p-4 bg-white shadow-md rounded mb-4">
                <h3 className="text-lg font-bold">{app.title}</h3>
                <p className="text-sm text-gray-600">Date: {app.date}</p>
                <p className={`text-sm ${app.status === 'Pending' ? 'text-yellow-500' : app.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    Status: {app.status}
                </p>
            </div>
        ));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Applications</h1>
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded flex items-center space-x-2 ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <FaClock />
                    <span>Pending</span>
                </button>
                <button
                    className={`px-4 py-2 rounded flex items-center space-x-2 ${activeTab === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('accepted')}
                >
                    <FaCheck />
                    <span>Accepted</span>
                </button>
                <button
                    className={`px-4 py-2 rounded flex items-center space-x-2 ${activeTab === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    <FaTimes />
                    <span>Rejected</span>
                </button>
            </div>
            <div className="applications">
                {renderApplications(activeTab)}
            </div>
        </div>
    );
};

export default MyApplicationsPage;