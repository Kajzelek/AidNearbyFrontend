import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";


const MyHistoryPage = () => {
  const [completedAds, setCompletedAds] = useState([]);
  const [completedApplications, setCompletedApplications] = useState([]);

  useEffect(() => {
    const fetchCompletedAds = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("http://localhost:8080/api/ads/getAdsByUserId?status=INACTIVE", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
      
          const data = await response.json();
          setCompletedAds(data); // Zakładam, że masz useState dla completedAds
        } catch (error) {
          console.error("Error fetching completed ads:", error);
          toast.error("Błąd podczas pobierania zakończonych ogłoszeń");
        }
      };

      const fetchCompletedApplications = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("http://localhost:8080/api/adApplications?status=FINISHED", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
      
          const data = await response.json();
          setCompletedApplications(data); // Zakładam, że masz useState dla completedApplications
        } catch (error) {
          console.error("Error fetching completed applications:", error);
          toast.error("Błąd podczas pobierania zakończonych aplikacji");
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

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Completed Advertisements</h2>
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
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Completed Applications</h2>
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

export default MyHistoryPage;
