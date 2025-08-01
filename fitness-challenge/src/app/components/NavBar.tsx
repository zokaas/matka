"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { ThemeColors } from "../themes/themeTypes";

interface User {
  username: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function Navbar() {
  const { t, colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser, logout, isLoggedIn } = useAuth();

  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const mobileDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDropdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/users`);
        if (!response.ok) throw new Error(t.navbar.failedToFetchUsers);
        setUsers(await response.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t.navbar.failedToFetchUsers]);

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
    <nav
      className="shadow-xl border-b"
      style={{
        background: `linear-gradient(to right, ${colors.primary}, ${colors.background})`,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold flex items-center" style={{ color: colors.text }}>
            🏔️ {t.navbar.title} 🏔️
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/" style={navLinkStyle(colors)}>{t.ui.backToHome}</Link>
            <Link href="/insights" style={navLinkStyle(colors)}>{t.navbar.statistics}</Link>

            {isLoggedIn && (
              <>
                <div className="relative">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    style={navLinkStyle(colors)}
                  >
                    {t.navbar.climbers}
                    <svg className="ml-1 h-4 w-4 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div
                      ref={dropdownContentRef}
                      className="absolute right-0 mt-2 rounded shadow-xl w-48 z-10"
                      style={{
                        backgroundColor: colors.card,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {loading ? (
                        <p className="px-4 py-2">{t.navbar.loadingClimbers}...</p>
                      ) : error ? (
                        <p className="px-4 py-2 text-red-500">{t.navbar.errorLoadingClimbers}</p>
                      ) : (
                        users.map((user) => (
                          <Link
                            key={user.username}
                            href={`/user/${user.username}`}
                            className="block px-4 py-2"
                            style={{ color: colors.text }}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            🧗‍♂️ {user.username}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 ml-4 pl-4" style={{ borderLeft: `1px solid ${colors.border}` }}>
                  <Link
                    href={`/user/${currentUser}`}
                    style={{ color: colors.text }}
                    className="flex items-center hover:underline"
                  >
                    <span className="text-2xl mr-1">🧗‍♂️</span>
                    {currentUser}
                  </Link>
                  <button
                    onClick={logout}
                    title={t.navbar.logout}
                    style={{
                      backgroundColor: "transparent",
                      color: colors.text,
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                    }}
                    className="hover:opacity-80 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Hamburger for mobile */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden"
            style={{ color: colors.text }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ backgroundColor: colors.card, color: colors.text, borderTop: `1px solid ${colors.border}` }}>
          <Link href="/" className="block px-4 py-2" onClick={() => setIsMenuOpen(false)}>{t.ui.backToHome}</Link>
          <Link href="/insights" className="block px-4 py-2" onClick={() => setIsMenuOpen(false)}>{t.navbar.statistics}</Link>

          {isLoggedIn && (
            <>
              <button
                ref={mobileDropdownButtonRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="block w-full text-left px-4 py-2"
              >
                {t.navbar.climbers}
              </button>
              {isDropdownOpen && (
                <div ref={mobileDropdownContentRef}>
                  {users.map((user) => (
                    <Link
                      key={user.username}
                      href={`/user/${user.username}`}
                      className="block px-6 py-2"
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
              <div style={{ borderTop: `1px solid ${colors.border}` }}>
                <Link
                  href={`/user/${currentUser}`}
                  className="block px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🧗‍♂️ {t.navbar.ownProfile} ({currentUser})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2"
                  style={{ color: "red" }}
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  {t.navbar.logout}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function navLinkStyle(colors: ThemeColors): React.CSSProperties {
  return {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s",
    color: colors.text,
    backgroundColor: "transparent",
    cursor: "pointer",
  };
}