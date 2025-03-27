import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Tag, Users, Bell, Database } from 'lucide-react';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: <Tag className="w-4 h-4" />,
      label: 'Discount Management',
      description: 'Configure parking discounts and offers',
      path: '/admin/discounts'
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'User Management',
      description: 'Manage user roles and permissions',
      path: '/admin/users'
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: 'Notifications',
      description: 'Configure system notifications',
      path: '/admin/notifications'
    },
    {
      icon: <Database className="w-4 h-4" />,
      label: 'System Settings',
      description: 'General system configuration',
      path: '/admin/settings'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-blue-100 text-blue-600' 
            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <div className={`p-2 rounded-lg ${
                item.path === '/admin/discounts' 
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown; 