import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/solid";

const AdsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <div className="max-w-3xl w-full space-y-8 px-6">
        <h1 className="text-4xl font-extrabold text-center">
          Zarządzaj Swoimi Ogłoszeniami
        </h1>
        <div className="grid gap-6 sm:grid-cols-2">
          <Link to="/my-ads" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg bg-white text-black hover:scale-105 transform transition duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex flex-col items-center justify-center py-12 px-6">
                <h2 className="text-2xl font-bold">Moje Ogłoszenia</h2>
                <ArrowRightIcon className="w-8 h-8 mt-4 opacity-50 group-hover:opacity-100 transition duration-300" />
              </div>
            </div>
          </Link>
          <Link to="/my-applications" className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg bg-white text-black hover:scale-105 transform transition duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-600 opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex flex-col items-center justify-center py-12 px-6">
                <h2 className="text-2xl font-bold">Moje Zgłoszenia</h2>
                <ArrowRightIcon className="w-8 h-8 mt-4 opacity-50 group-hover:opacity-100 transition duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
