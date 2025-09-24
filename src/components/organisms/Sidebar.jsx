import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Reservations", href: "/reservations", icon: "Calendar" },
    { name: "Rooms", href: "/rooms", icon: "Bed" },
    { name: "Guests", href: "/guests", icon: "Users" },
    { name: "Housekeeping", href: "/housekeeping", icon: "Sparkles" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Hotel" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Innkeeper Pro
                </h1>
                <p className="text-xs text-gray-500">Hotel Management</p>
              </div>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-blue-50 text-primary border-r-2 border-primary"
                      : "text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-50"
                  }`
                }
              >
                <ApperIcon
                  name={item.icon}
                  className="mr-3 h-5 w-5 flex-shrink-0"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl transform transition-transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Hotel" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      Innkeeper Pro
                    </h1>
                    <p className="text-xs text-gray-500">Hotel Management</p>
                  </div>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-blue-50 text-primary border-r-2 border-primary"
                          : "text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-50"
                      }`
                    }
                  >
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 h-5 w-5 flex-shrink-0"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;