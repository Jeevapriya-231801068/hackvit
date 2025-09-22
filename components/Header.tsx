import React from 'react';
import { useAuth } from '../Auth';
import { ShieldCheckIcon, ArrowRightOnRectangleIcon } from './icons';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Car Damage Assessor</h1>
              <p className="text-sm text-gray-500">Multimodal Damage & Fraud Analysis Engine</p>
            </div>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium capitalize">{user.username}</span> ({user.role})
            </span>
            <button
              onClick={logout}
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
