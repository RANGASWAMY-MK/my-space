import React, { useState } from 'react';
import { Menu, X, Home, Settings, Users, FileText, Mail, Bell, LogOut } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={20} />,
      href: '/',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <Mail size={20} />,
      href: '/messages',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      href: '/notifications',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={20} />,
      href: '/users',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={20} />,
      href: '/documents',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/settings',
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold tracking-wide">MySpace</h1>
          <p className="text-sm text-blue-200 mt-1">Navigation</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-70 transition-colors duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-shrink-0 text-blue-200 group-hover:text-white transition-colors">
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-blue-700 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 hover:bg-opacity-70 transition-colors duration-200 group">
            <span className="flex-shrink-0 text-blue-200 group-hover:text-white transition-colors">
              <LogOut size={20} />
            </span>
            <span className="flex-1 font-medium text-left">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Margin Adjuster */}
      <div className="hidden md:block w-64" />
    </>
  );
};

export default Sidebar;
