import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";

const CompletedHistoryPage = () => {
  const [completedAds, setCompletedAds] = useState([]);
  const [completedApplications, setCompletedApplications] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    const fetchCompletedAds = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8080/api/ads/getAdsByUserId", {
          params: { status: "INACTIVE" },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedAds(response.data);
      } catch (error) {
        console.error("Error fetching completed ads:", error);
      } finally {
        setLoadingAds(false);
      }
    };

    const fetchCompletedApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8080/api/applications/getApplicationsByUserId", {
          params: { status: "FINISHED" },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompletedApplications(response.data);
      } catch (error) {
        console.error("Error fetching completed applications:", error);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchCompletedAds();
    fetchCompletedApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Completed History</h1>
      </header>

      {/* Completed Ads Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Completed Advertisements</h2>
        {loadingAds ? (
          <p>Loading completed ads...</p>
        ) : completedAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedAds.map((ad) => (
              <CardComponent
                key={ad.adId}
                title={ad.adTitle}
                description={ad.adDescription}
                icon={<FiCheckCircle className="text-green-500" />}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No completed advertisements found.</p>
        )}
      </section>

      {/* Completed Applications Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Completed Applications</h2>
        {loadingApplications ? (
          <p>Loading completed applications...</p>
        ) : completedApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedApplications.map((app) => (
              <CardComponent
                key={app.adApplicationId}
                title={app.adTitle}
                description={app.userMessage}
                icon={<FiCheckCircle className="text-blue-500" />}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No completed applications found.</p>
        )}
      </section>
    </div>
  );
};

const CardComponent = ({ title, description, icon }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 font-bold">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default CompletedHistoryPage;
