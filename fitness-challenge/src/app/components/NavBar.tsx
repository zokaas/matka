"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Mountain } from "lucide-react";

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

  const { currentUser, logout, isLoggedIn } = useAuth();

  // Refs for dropdown buttons and content
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const mobileDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDropdownContentRef = useRef<HTMLDivElement>(null);

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

  // Handle clicks anywhere in the document
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDropdownOpen) return;

      const clickedElement = event.target as Node;

      const isOutsideDesktopDropdown =
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(clickedElement) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(clickedElement);

      const isOutsideMobileDropdown =
        mobileDropdownButtonRef.current &&
        !mobileDropdownButtonRef.current.contains(clickedElement) &&
        mobileDropdownContentRef.current &&
        !mobileDropdownContentRef.current.contains(clickedElement);

      if (isMenuOpen) {
        if (isOutsideMobileDropdown) {
          setIsDropdownOpen(false);
        }
      } else {
        if (isOutsideDesktopDropdown) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMenuOpen]);

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home */}
          <Link href="/" className="text-xl font-bold transition-colors flex items-center ">
            🏔️ TOUR DE FRANCE 🏔️
          </Link>

          {/* Links for Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/"
              className="hover:bg-slate-700 px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Etusivu
            </Link>
            <Link
              href="/insights"
              className="hover:bg-slate-700 px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Tilastot
            </Link>
            
            {/* User-specific links */}
            {isLoggedIn && (
              <>
                {/* Dropdown for Users */}
                <div className="relative">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="hover:bg-slate-700 px-3 py-2 rounded text-sm font-medium flex items-center transition-colors"
                  >
                    Kiipeilijät
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
                    <div
                      ref={dropdownContentRef}
                      className="absolute right-0 mt-2 bg-slate-800 text-white rounded shadow-xl w-48 z-10 border border-slate-700"
                    >
                      {loading ? (
                        <p className="text-gray-400 px-4 py-2">
                          Ladataan kiipeilijöitä...
                        </p>
                      ) : error ? (
                        <p className="text-red-400 px-4 py-2">
                          Virhe kiipeilijöiden haussa
                        </p>
                      ) : (
                        users.map((user) => (
                          <Link
                            key={user.username}
                            href={`/user/${user.username}`}
                            className="block px-4 py-2 hover:bg-slate-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            🧗‍♂️ {user.username}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Current User Display */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-600">
                  <Link
                    href={`/user/${currentUser}`}
                    className="hover:text-cyan-300 transition-colors flex items-center"
                  >
                    <span className="text-2xl mr-1">🧗‍♂️</span>
                    {currentUser}
                  </Link>
                  <button
                    onClick={logout}
                    className="hover:bg-red-600 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center"
                    title="Kirjaudu ulos"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
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
        <div className="md:hidden bg-800 border-t border-slate-700">
          <Link
            href="/"
            className="block px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Etusivu
          </Link>
          <Link
            href="/insights"
            className="block px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Tilastot
          </Link>
          
          {isLoggedIn && (
            <>
              <div>
                <button
                  ref={mobileDropdownButtonRef}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Kiipeilijät
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
                  <div
                    ref={mobileDropdownContentRef}
                    className="bg-slate-900 text-white"
                  >
                    {users.map((user) => (
                      <Link
                        key={user.username}
                        href={`/user/${user.username}`}
                        className="block px-6 py-2 text-sm hover:bg-800 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsDropdownOpen(false);
                        }}
                      >
                        🧗‍♂️ {user.username}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-700 pt-2">
                <Link
                  href={`/user/${currentUser}`}
                  className="block px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🧗‍♂️ Oma profiili ({currentUser})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Kirjaudu ulos
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}