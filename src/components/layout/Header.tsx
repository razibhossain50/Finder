"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Layout, Menu, X, User, ChevronDown, LogIn, UserPlus, Settings, LogOut, UserRoundPen, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Find your partner', href: '/', active: true },
    { label: 'Find your doctor', href: '/search/doctor' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Left section */}
              <div className="flex items-center">
                {/* Mobile menu button */}
                <div className="md:hidden" ref={mobileMenuRef}>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" />
                    ) : (
                      <Menu className="block h-6 w-6" />
                    )}
                  </button>

                  {/* Mobile menu dropdown */}
                  <div
                    className={`absolute left-0 mt-2 w-full px-2 pt-2 pb-3 bg-white shadow-lg rounded-md transition-all duration-200 transform ${
                      isMobileMenuOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          item.active
                            ? 'text-indigo-700 bg-indigo-50'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Logo */}
                <Link
                  href="/"
                  >
                <div className="flex items-center gap-2">
                  <Layout className="h-6 w-6 text-indigo-600" />
                  <span className="font-bold text-lg">Finder</span>
                </div>

                </Link>
              </div>

              {/* Middle section - Navigation Items (hidden on mobile) */}
              <div className="hidden md:flex items-center justify-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                      item.active
                        ? 'text-indigo-700 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Right section */}
              <div className="flex items-center space-x-4">
                {/* Auth Buttons (hidden on mobile) */}
                <div className="hidden md:flex items-center space-x-2">

                  <Link
                      href="/auth/login"
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-150 ease-in-out"
                    >
                       Login
                    </Link>
                     <Link
                      href="/auth/signup"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-150 ease-in-out"
                    >
                       Sign Up
                    </Link>
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 focus:outline-none"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out transform origin-top-right ${
                      isProfileMenuOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-2 text-xs text-gray-500">Account</div>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                       Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                       <UserRoundPen className="mr-2 h-4 w-4" />
                       Profile
                    </Link>
                    <Link
                      href="/auth/login"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                       <LogIn className="mr-2 h-4 w-4" />
                       Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                       <UserPlus className="mr-2 h-4 w-4" />
                       Sign Up
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
    </header>
  );
}

export default Header;