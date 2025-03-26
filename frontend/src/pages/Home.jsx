// src/components/Home.jsx
import React from 'react';
import Header from '../components/Header';

const Home = () => {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <header className="text-center py-10 bg-gray-100 mb-5">
          <h1 className="m-0 text-4xl text-gray-900 font-bold">
            Smart Parking Management System
          </h1>
          <p className="text-lg text-gray-600">
            A user-friendly solution for parking automation
          </p>
        </header>

        {/* Features Section */}
        <section className="flex justify-between gap-5">
          {/* Feature Box */}
          <div className="flex-1 p-5 bg-white rounded-lg shadow-md text-center">
            <h2 className="mb-2 text-xl text-gray-900 font-semibold">
              Automatic Detection
            </h2>
            <p className="text-gray-600">Vehicle and spot allocation</p>
          </div>

          <div className="flex-1 p-5 bg-white rounded-lg shadow-md text-center">
            <h2 className="mb-2 text-xl text-gray-900 font-semibold">
              Real-Time Monitoring
            </h2>
            <p className="text-gray-600">Parking spot status updates</p>
          </div>

          <div className="flex-1 p-5 bg-white rounded-lg shadow-md text-center">
            <h2 className="mb-2 text-xl text-gray-900 font-semibold">
              Digital Payments
            </h2>
            <p className="text-gray-600">Seamless with QR codes</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;