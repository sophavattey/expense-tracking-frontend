"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-gray-800 font-black text-xl tracking-tight font-['Sora',sans-serif]">
            Fin<span className="text-blue-600">Set</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features",     href: "#features"      },
            { label: "How it Works", href: "#how-it-works"  },
            { label: "Contact",      href: "#contact"       },
          ].map((item) => (
            <a key={item.label} href={item.href}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 bg-gray-100 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard"
                className="text-gray-600 text-sm font-semibold hover:text-gray-800 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 shadow" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
                    {user?.name?.charAt(0) ?? "?"}
                  </div>
                )}
                <span className="text-gray-700 text-sm font-medium hidden lg:block">
                  {user?.name?.split(" ")[0]}
                </span>
                <button onClick={() => logout()}
                  className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors ml-1">
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-gray-600 text-sm font-semibold hover:text-gray-800 transition-colors">
                Log in
              </Link>
              <Link href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-gray-100 px-6 pb-4 shadow-lg">
          <div className="flex flex-col gap-1 pt-2">
            {[
              { label: "Features",     href: "#features"     },
              { label: "How it Works", href: "#how-it-works" },
              { label: "Contact",      href: "#contact"      },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="text-gray-700 text-sm font-medium py-3 border-b border-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard"
                    className="flex-1 text-center text-blue-600 text-sm font-semibold py-2.5 border border-blue-200 rounded-xl"
                    onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex-1 text-center bg-red-50 text-red-500 text-sm font-bold py-2.5 rounded-xl border border-red-100">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="flex-1 text-center text-gray-700 text-sm font-semibold py-2.5 border border-gray-200 rounded-xl">
                    Log in
                  </Link>
                  <Link href="/signup"
                    className="flex-1 text-center bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}