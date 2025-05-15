import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getVehicleByPlate, processPayment } from '../services/vehicleService';

const PaymentPage = () => {
  const { plateNumber } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getVehicleByPlate(plateNumber)
      .then((v) => {
        setVehicle(v);
        setPaid(v.paymentStatus === 'paid');
        setLoading(false);
      })
      .catch(() => { setError('Vehicle not found'); setLoading(false); });
  }, [plateNumber]);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setPaid(true);
      setProcessing(false);
      setTimeout(() => {
        navigate(`/gate-open`);
      }, 2000);
    }, 1500);
  };

  const amount = location.state?.fees || vehicle?.currentCharge || vehicle?.charge || '...';

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment for {plateNumber}</h2>
        <p className="mb-2">Amount to Pay: <span className="font-semibold">${amount}</span></p>
        {paid ? (
          <div className="text-green-700 text-xl font-bold mt-8">
            Payment completed!<br />Redirecting to gate...
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Card Number</label>
              <input type="text" className="w-full border rounded px-2 py-1" maxLength={16} required value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
            </div>
            <div className="flex space-x-2">
              <div>
                <label className="block text-sm font-medium">Expiry</label>
                <input type="text" className="w-full border rounded px-2 py-1" maxLength={5} placeholder="MM/YY" required value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">CVV</label>
                <input type="password" className="w-full border rounded px-2 py-1" maxLength={4} required value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white rounded py-2 font-semibold" disabled={processing}>
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 