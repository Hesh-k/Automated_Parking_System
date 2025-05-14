import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AdminPanelLoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('password');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const userGivenEmail = email.trim();
    const userGivenPassword = password;

    if (userGivenEmail === "admin@email.com" && userGivenPassword === "admin") {
      navigate('/admin');
    } else {
      window.alert('Invalid email or password');
    }

    setIsLoading(false);
  };

  const handleInputTypeToggle = () => {
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="text-sm text-gray-500 mt-2">Access the Parking Management Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Admin Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={inputType}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter Admin Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleInputTypeToggle}
              >
                {inputType === 'password' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-5">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 transition">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelLoginForm;
