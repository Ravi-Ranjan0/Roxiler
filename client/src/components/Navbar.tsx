import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";
import Logout from "./Logout";
import type { UserRole } from "@/schemas/user.schema";
import { X, Menu } from "lucide-react";


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
      { label: "Dashboard", href: "/storeowner/dashboard" },
      { label: "Profile", href: "/storeowner/profile" },
    ],
    USER: [
      { label: "Stores", href: "/user/dashboard" },
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
          <div className="flex-shrink-0 text-xl font-bold text-blue-600">
            <Link to="/">Roxiler</Link>
          </div>

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

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

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
