// src/components/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <header style={{
        textAlign: 'center',
        padding: '40px 0',
        backgroundColor: '#f5f5f5',
        marginBottom: '20px'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '2.5em',
          color: '#333'
        }}>
          Smart Parking Management System
        </h1>
        <p style={{
          fontSize: '1.2em',
          color: '#666'
        }}>
          A user-friendly solution for parking automation
        </p>
      </header>

      <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0 0 10px',
            color: '#333'
          }}>
            Automatic Detection
          </h2>
          <p style={{
            margin: '0',
            color: '#666'
          }}>
            Vehicle and spot allocation
          </p>
        </div>

        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0 0 10px',
            color: '#333'
          }}>
            Real-Time Monitoring
          </h2>
          <p style={{
            margin: '0',
            color: '#666'
          }}>
            Parking spot status updates
          </p>
        </div>

        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0 0 10px',
            color: '#333'
          }}>
            Digital Payments
          </h2>
          <p style={{
            margin: '0',
            color: '#666'
          }}>
            Seamless with QR codes
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;