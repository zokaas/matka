"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  username: string;
}
      const backendUrl = "https://matka-zogy.onrender.com";

export default function Navbar() {
  const [users, setUsers] = useState<User[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        setUsers(await response.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <nav className="bg-purple-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home */}
          <Link href="/" className="text-xl font-bold hover:text-purple-300">
            🌍 MAAILMAN YMPÄRI 🌍
          </Link>

          {/* Links for Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/"
              className="hover:bg-purple-500 px-3 py-2 rounded text-sm font-medium"
            >
              Home
            </Link>
            {/* Dropdown for Users */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="hover:bg-purple-500 px-3 py-2 rounded text-sm font-medium flex items-center"
              >
                Users
                <svg
                  className="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow w-48 z-10">
                  {loading ? (
                    <p className="text-gray-500 px-4 py-2">Loading users...</p>
                  ) : error ? (
                    <p className="text-red-500 px-4 py-2">
                      Error fetching users
                    </p>
                  ) : (
                    users.map((user) => (
                      <Link
                        key={user.username}
                        href={`/user/${user.username}`}
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {user.username}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            <Link
              href="/insights"
              className="hover:bg-purple-500 px-3 py-2 rounded text-sm font-medium"
            >
              Insights
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-500">
          <Link
            href="/"
            className="block px-4 py-2 text-sm font-medium hover:bg-purple-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-purple-800"
          >
            Users
            <svg
              className="ml-1 h-4 w-4 inline-block"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="bg-purple-800 text-white">
              {users.map((user) => (
                <Link
                  key={user.username}
                  href={`/user/${user.username}`}
                  className="block px-4 py-2 text-sm hover:bg-purple-900"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  {user.username}
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/insights"
            className="block px-4 py-2 text-sm font-medium hover:bg-purple-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Insights
          </Link>
        </div>
      )}
    </nav>
  );
};
