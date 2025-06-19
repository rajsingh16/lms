import React from 'react';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { auth, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      finance_officer: 'bg-green-100 text-green-800',
      loan_officer: 'bg-orange-100 text-orange-800',
      field_officer: 'bg-yellow-100 text-yellow-800',
      viewer: 'bg-gray-100 text-gray-800',
      editor: 'bg-indigo-100 text-indigo-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {auth.user?.first_name?.[0]}{auth.user?.last_name?.[0]}
              </span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {auth.user?.first_name} {auth.user?.last_name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(auth.user?.role || '')}`}>
                      {auth.user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};