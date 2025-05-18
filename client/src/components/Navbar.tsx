import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router"; // FIXED
import Logout from "./Logout"; // Your reusable component
import type { UserRole } from "@/schemas/user.schema";


type MenuItem = {
  label: string;
  href: string;
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth } = useAuth();

  const accessToken = auth?.accessToken;
  const UserRole: UserRole = auth?.user?.role ?? "USER";

  const menuItems: Record<UserRole | "guest", MenuItem[]> = {
    ADMIN: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Create Store", href: "/admin/create-store" },
      { label: "Add Account", href: "/admin/add-new" },
    ],
    STORE_OWNER: [
      { label: "Dashboard", href: "/owner/dashboard" },
      { label: "Profile", href: "/owner/profile" },
    ],
    USER: [
      { label: "Stores", href: "/user/store-list" },
      { label: "Profile", href: "/user/profile" },
    ],
    guest: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/signup" },
    ],
  };

  const currentMenuItems = accessToken ? menuItems[UserRole] : menuItems.guest;

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-blue-600">
            <Link to="/">Roxiler</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center space-x-6">
            {currentMenuItems.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}

            {accessToken && (
              <>
                <span className="text-sm text-gray-500">Hi, {auth?.user?.name}</span>
                <Logout />
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <ul className="space-y-2 px-4 py-4">
            {currentMenuItems.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            {accessToken && (
              <>
                <li className="text-sm text-gray-500 py-1">Hi, {auth?.user?.name}</li>
                <li onClick={() => setMobileMenuOpen(false)}>
                  <Logout />
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
