import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Smart Parking</h1>
        <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">Admin Panel</a>
          <a href="#" className="hover:text-gray-400">Reports</a>
          <a href="#" className="hover:text-gray-400">Parking Status</a>
        </nav>
        <div className="hidden md:flex space-x-4">
          <a href="#" className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-700">
            Log In
          </a>
          <a href="#" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            Sign Up
          </a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden flex flex-col items-center bg-gray-800 text-white py-4 space-y-4">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">Admin Panel</a>
          <a href="#" className="hover:text-gray-400">Reports</a>
          <a href="#" className="hover:text-gray-400">Parking Status</a>
          <a href="#" className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-700">
            Log In
          </a>
          <a href="#" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            Sign Up
          </a>
        </nav>
      )}
    </header>
  );
}
