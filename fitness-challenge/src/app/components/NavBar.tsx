"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function Navbar() {
  const { t, colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);         // mobile hamburger
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // users dropdown (desktop OR mobile)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser, logout, isLoggedIn } = useAuth();
  const router = useRouter();

  // Refs for outside-click handling
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isDropdownOpen) return;
      const target = event.target as Node;

      const clickedOutsideDesktop =
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(target) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(target);

      const clickedOutsideMobile =
        mobileDropdownButtonRef.current &&
        !mobileDropdownButtonRef.current.contains(target) &&
        mobileDropdownContentRef.current &&
        !mobileDropdownContentRef.current.contains(target);

      if (isMenuOpen) {
        if (clickedOutsideMobile) setIsDropdownOpen(false);
      } else {
        if (clickedOutsideDesktop) setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const navLinkStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s",
    color: colors.text,
    backgroundColor: "transparent",
    cursor: "pointer",
    textDecoration: "none",
  };

  const navLinkHoverStyle: React.CSSProperties = {
    ...navLinkStyle,
    backgroundColor: colors.secondary,
  };

  return (
    <nav
      className="shadow-xl border-b relative" // relative to anchor absolutely-positioned dropdowns
      style={{
        background: `linear-gradient(to right, ${colors.primary}, ${colors.background})`,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Home */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center hover:opacity-80 transition-opacity"
            style={{ color: colors.text, textDecoration: "none" }}
          >
            {t.navbar.title}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/"
              className="hover:opacity-80 transition-all duration-200 rounded-lg px-3 py-2"
              style={navLinkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navLinkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
            >
              {t.ui.backToHome}
            </Link>

            <Link
              href="/insights"
              className="hover:opacity-80 transition-all duration-200 rounded-lg px-3 py-2"
              style={navLinkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navLinkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
            >
              {t.navbar.statistics}
            </Link>

            <Link
              href="/info"
              className="hover:opacity-80 transition-all duration-200 rounded-lg px-3 py-2"
              style={navLinkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navLinkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
            >
              Info
            </Link>

            {isLoggedIn && (
              <>
                {/* Users Dropdown (desktop) */}
                <div className="relative">
                  <button
                    ref={dropdownButtonRef}
                    onClick={() => {
                      setIsMenuOpen(false);            // close mobile menu if open
                      setIsDropdownOpen((prev) => !prev);
                    }}
                    className="hover:opacity-80 transition-all duration-200 rounded-lg px-3 py-2 flex items-center"
                    style={navLinkStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, navLinkHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navLinkStyle)}
                  >
                    {t.navbar.climbers}
                    <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && !isMenuOpen && (
                    <div
                      ref={dropdownContentRef}
                      className="absolute right-0 mt-2 rounded shadow-xl w-56 z-[9999]" // HIGH z-index
                      style={{
                        backgroundColor: colors.card,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {loading ? (
                        <p className="px-4 py-2" style={{ color: colors.textSecondary }}>
                          {t.navbar.loadingClimbers}...
                        </p>
                      ) : error ? (
                        <p className="px-4 py-2" style={{ color: colors.error }}>
                          {t.navbar.errorLoadingClimbers}
                        </p>
                      ) : (
                        users.map((user) => (
                          <Link
                            key={user.username}
                            href={`/user/${user.username}`}
                            className="block px-4 py-2 hover:opacity-80 transition-opacity"
                            style={{ color: colors.text, textDecoration: "none" }}
                            onClick={() => setIsDropdownOpen(false)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            🚴 {user.username}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Current User + Logout */}
                <div className="flex items-center space-x-3 ml-4 pl-4" style={{ borderLeft: `1px solid ${colors.border}` }}>
                  <Link
                    href={`/user/${currentUser}`}
                    className="hover:opacity-80 transition-opacity flex items-center"
                    style={{ color: colors.text, textDecoration: "none" }}
                  >
                    <span className="text-2xl mr-1">🚴</span>
                    {currentUser}
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="hover:opacity-80 transition-all duration-200 rounded p-2"
                    style={{ backgroundColor: "transparent", color: colors.text, border: "none", cursor: "pointer" }}
                    title={t.navbar.logout}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.error)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Profile Button & Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            {isLoggedIn && currentUser && (
              <Link
                href={`/user/${currentUser}`}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium"
                style={{ textDecoration: "none" }}
              >
                <span className="text-lg">🚴</span>
                <span className="text-sm">{currentUser}</span>
              </Link>
            )}

            <button
              onClick={() => {
                setIsMenuOpen((prev) => {
                  const next = !prev;
                  if (next) setIsDropdownOpen(false); // close user dropdown when opening menu
                  return next;
                });
              }}
              className="hover:opacity-80 transition-opacity p-2"
              style={{ color: colors.text, backgroundColor: "transparent", border: "none" }}
              aria-expanded={isMenuOpen}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden relative z-[9999]" // HIGH z-index for whole mobile panel
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <Link
              href="/"
              className="block px-4 py-2 hover:opacity-80 transition-opacity"
              style={{ color: colors.text, textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {t.ui.backToHome}
            </Link>

            <Link
              href="/insights"
              className="block px-4 py-2 hover:opacity-80 transition-opacity"
              style={{ color: colors.text, textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {t.navbar.statistics}
            </Link>

            <Link
              href="/info"
              className="block px-4 py-2 hover:opacity-80 transition-opacity"
              style={{ color: colors.text, textDecoration: "none" }}
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Info
            </Link>

            {isLoggedIn && (
              <>
                <div>
                  <button
                    ref={mobileDropdownButtonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="block w-full text-left px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{ color: colors.text, backgroundColor: "transparent", border: "none" }}
                    aria-expanded={isDropdownOpen}
                  >
                    {t.navbar.climbers}
                    <svg className="ml-1 h-4 w-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
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
                      className="relative z-[9999]" // keep above everything
                      style={{ backgroundColor: colors.background }}
                    >
                      {users.map((user) => (
                        <Link
                          key={user.username}
                          href={`/user/${user.username}`}
                          className="block px-6 py-2 hover:opacity-80 transition-opacity"
                          style={{ color: colors.text, textDecoration: "none" }}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsDropdownOpen(false);
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          🚴 {user.username}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "0.5rem" }}>
                  <Link
                    href={`/user/${currentUser}`}
                    className="block px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{ color: colors.text, textDecoration: "none" }}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    🚴 {t.navbar.ownProfile} ({currentUser})
                  </Link>

                  <button
                    onClick={async () => {
                      await logout();
                      setIsMenuOpen(false);
                      router.push("/");
                    }}
                    className="block w-full text-left px-4 py-2 hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.error)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    aria-label={t.navbar.logout}
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    <span style={{ color: colors.error }}>{t.navbar.logout}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
