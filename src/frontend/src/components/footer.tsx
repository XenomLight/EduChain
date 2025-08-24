import React from 'react';
import {
  FaInstagram,
  FaPinterest,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
  FaTimes,
} from 'react-icons/fa';
import logo from '../assets/icons/educhain..svg';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-black px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="EduChain logo"
            className="h-32 w-32 object-contain"
          />
        </div>

        <div className="flex w-full flex-col items-center space-y-6 md:items-end">
          <div className="flex space-x-5 text-xl">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTimes className="cursor-pointer hover:text-cyan-400" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="cursor-pointer hover:text-cyan-400" />
            </a>
            <a
              href="https://www.pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPinterest className="cursor-pointer hover:text-cyan-400" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="cursor-pointer hover:text-cyan-400" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="cursor-pointer hover:text-cyan-400" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="cursor-pointer hover:text-cyan-400" />
            </a>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400 md:justify-end">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Plans & Pricing</Link>
            <Link to="/news">News & Blogs</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/about">About Us</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>

          <div className="text-center text-xs text-gray-500 md:text-right">
            © Copyright 2025 EduChain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
