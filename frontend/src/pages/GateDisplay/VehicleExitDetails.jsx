import React from 'react';
import VehicleDetailsCard from '../../components/VehicleDetailsCard';
import PaymentQRCode from '../../components/PaymentQRCode';

const VehicleExitDetails = ({ vehicle, parkingDetails }) => {
  // Calculate parking duration and fee
  const calculateParkingFee = () => {
    const hourlyRate = 2; // $2 per hour
    const hours = parkingDetails.duration;
    return hours * hourlyRate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Exit</h2>
          <p className="text-gray-600">Please complete payment to exit</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <VehicleDetailsCard vehicle={vehicle} />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Parking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Entry Time:</span>
                  <span>{parkingDetails.entryTime}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Duration:</span>
                  <span>{parkingDetails.duration} hours</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Rate:</span>
                  <span>$2/hour</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>${calculateParkingFee()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Scan to Pay</h3>
            <PaymentQRCode 
              vehicleId={vehicle.id} 
              amount={calculateParkingFee()}
              parkingDetails={parkingDetails}
            />
            <p className="text-sm text-gray-500 mt-4">
              After payment confirmation, the gate will open automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleExitDetails; 