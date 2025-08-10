import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import logo from "../assets/icons/eduChain.svg";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] bg-black/60 backdrop-blur-md rounded-2xl z-50 px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
      </div>

      {/* Right: Menu + Search + Auth */}
      <div className="flex items-center gap-6 text-[#EEEEEE]">
        {[
          { name: "Home", to: "/" },
          { name: "Courses", to: "/courses" },
          { name: "Partners", to: "/partners" },
        ].map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="relative group hover:text-white transition"
          >
            {link.name}
            {/* Garis bawah animasi */}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2A8188] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}

        {/* Search */}
        <div className="flex items-center bg-[#222222] rounded-lg px-3 py-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#2A8188] focus-within:bg-[#2f2f2f]">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search With..."
            className="bg-transparent text-gray-200 placeholder-gray-500 outline-none px-2 w-28 sm:w-40"
          />
          <button
            type="button"
            className="bg-[#2A8188] px-3 py-1 rounded-md hover:bg-[#246d73] transition"
            aria-label="Search"
            title="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Auth */}
        <Link
          to="/auth/login"
          className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className="px-4 py-2 rounded-lg bg-[#2A8188] text-white font-medium hover:bg-[#246d73] transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
