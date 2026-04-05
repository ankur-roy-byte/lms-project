import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Award, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../data/constants';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-brand-surface border-b border-white/[0.07] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-[52px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-syne font-extrabold text-sm text-white">
              {BRAND.shortName}<span className="text-accent">{BRAND.highlight}</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-text-secondary hover:text-text-primary text-sm font-medium transition">
                  Dashboard
                </Link>
                <Link to="/courses" className="text-text-secondary hover:text-text-primary text-sm font-medium transition">
                  Courses
                </Link>
                <Link to="/live-sessions" className="text-text-secondary hover:text-text-primary text-sm font-medium transition">
                  Live Sessions
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-text-secondary hover:text-text-primary text-sm font-medium transition">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-text-muted hover:text-text-primary transition">
                  <Bell className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-full py-[5px] pl-[5px] pr-3 hover:bg-white/10 transition"
                  >
                    <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-accent to-danger flex items-center justify-center text-[10px] font-extrabold text-brand-bg font-syne">
                      {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]?.[0]}.
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-brand-surface border border-white/[0.08] rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary flex items-center gap-2 text-sm"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/certificates"
                        className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary flex items-center gap-2 text-sm"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Award className="w-4 h-4" />
                        My Certificates
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 flex items-center gap-2 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-text-primary"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.07]">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/courses" className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary text-sm" onClick={() => setIsOpen(false)}>Courses</Link>
                <Link to="/live-sessions" className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary text-sm" onClick={() => setIsOpen(false)}>Live Sessions</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary text-sm" onClick={() => setIsOpen(false)}>Admin</Link>
                )}
                <Link to="/certificates" className="block px-4 py-2 text-text-secondary hover:bg-white/5 hover:text-text-primary text-sm" onClick={() => setIsOpen(false)}>Certificates</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 text-sm">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2 text-accent font-medium text-sm" onClick={() => setIsOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
