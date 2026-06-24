import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about" },
  { label: "Services", to: "/specialties" },
  { label: "Doctors", to: "/doctors" },
  { label: "News", to: "/news" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;
  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  setSearchQuery("");
  setSearchOpen(false);
  setMenuOpen(false);
};

  const dashboardPath = isAdmin ? "/admin/dashboard" : "/patient/dashboard";

  return (
    <nav className="bg-primary py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading">
          <span className="text-white">MEDI</span>
          <span className="text-accent">CORE</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-accent" : "text-white hover:text-accent"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-accent transition-colors"
            >
              <FaSearch size={18} />
            </button>
            {searchOpen && (
              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 flex overflow-hidden w-64 z-50"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors,services,..."
                  className="flex-1 px-4 py-2.5 text-sm text-primary outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary px-3 text-white hover:bg-accent transition-colors"
                >
                  <FaSearch size={14} />
                </button>
              </form>
            )}
          </div>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white text-sm font-medium hover:text-accent transition-colors"
              >
                <FaUserCircle size={20} />
                <span>{user?.name?.split(" ")[0]}</span>
                <FaChevronDown
                  size={12}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-primary truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <Link
                    to={dashboardPath}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  {!isAdmin && (
                    <Link
                      to="/appointment"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      Book Appointment
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 text-white text-sm font-medium hover:text-accent transition-colors"
              >
                <FaUserCircle size={18} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-cyan-400 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link
            to="/appointment"
            className="bg-white text-primary font-semibold text-sm px-5 py-2 rounded-full hover:bg-accent hover:text-white transition-all duration-200"
          >
            Appointment
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 px-4">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-white"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <hr className="border-white/20" />

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex overflow-hidden rounded-lg border border-white/20">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors..."
              className="flex-1 px-4 py-2 text-sm bg-white/10 text-white placeholder-white/50 outline-none"
            />
            <button type="submit" className="px-3 bg-accent text-white">
              <FaSearch size={14} />
            </button>
          </form>

          {isLoggedIn ? (
            <>
              <div className="text-white/70 text-xs">
                Signed in as{" "}
                <span className="text-white font-semibold">{user?.name}</span>
                <span className="ml-2 capitalize text-accent">
                  ({user?.role})
                </span>
              </div>
              <Link
                to={dashboardPath}
                onClick={() => setMenuOpen(false)}
                className="text-white text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-300 text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-full text-center"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link
            to="/appointment"
            onClick={() => setMenuOpen(false)}
            className="bg-white text-primary font-semibold text-sm px-6 py-2 rounded-full text-center"
          >
            Appointment
          </Link>
        </div>
      )}
    </nav>
  );
}