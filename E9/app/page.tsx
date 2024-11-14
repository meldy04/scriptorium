"use client";

import React, { useState } from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const authCards = [
    { id: 1, description: 'Author 1' },
    { id: 2, description: 'Author 2' },
    { id: 3, description: 'Author 3' },
    { id: 4, description: 'Author 4' },
    { id: 5, description: 'Author 5' },
    { id: 6, description: 'Author 6' },
    { id: 7, description: 'Author 7' },
    { id: 8, description: 'Author 8' },
  ];

  const storeCards = [
    { id: 1, title: 'Store Card 1', description: 'Description for store card 1.' },
    { id: 2, title: 'Store Card 2', description: 'Description for store card 2.' },
    { id: 3, title: 'Store Card 3', description: 'Description for store card 3.' },
  ];

  const featuredItems = [
    { id: 1, description: 'Book 1' },
    { id: 2, description: 'Book 2' },
    { id: 3, description: 'Book 3' },
  ];

  return (
      <div>
        <header id="header">
          <nav id="navbar" className="flex justify-between items-center p-4 bg-gray-800">
            {/* Logo */}
            <div className="text-white text-xl">Logo</div>

            {/* Navbar Links for large screens */}
            <div
                id="nav-links"
                className="hidden md:flex space-x-4 text-white"
            >
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
            </div>

            {/* Hamburger Menu for small screens */}
            <button
                id="hamburger-menu"
                className="block md:hidden text-white"
                onClick={toggleMenu}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Menu for small screens */}
            <div
                id="nav-links-sm"
                className={`${
                    isMenuOpen ? "block" : "hidden"
                } absolute top-0 right-0 mt-12 w-48 bg-gray-800 text-white flex flex-col items-center space-y-4 p-4 md:hidden`}
            >
              <a id={"authors"} href="#authors" onClick={() => setIsMenuOpen(false)}>Authors</a>
              <a id={"stores"} href="#about" onClick={() => setIsMenuOpen(false)}>Stores</a>
              <a id={"books"} href="#services" onClick={() => setIsMenuOpen(false)}>Books</a>
              <a id={"contact"} href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </nav>
        </header>


        <main id="main-content" className="relative px-6 pt-14 lg:px-8">
          <section className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {authCards.map((card) => (
                  <div
                      key={card.id}
                      className="card bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
                  >
                    <p className="card-description text-gray-600">{card.description}</p>
                  </div>
              ))}
            </div>
          </section>

          <section className="container mx-auto p-4">
            <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {storeCards.map((card) => (
                  <div
                      key={card.id}
                      className="card bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
                  >
                    <h2 className="card-title text-xl font-semibold mb-2">{card.title}</h2>
                    <p className="card-description text-gray-600">{card.description}</p>
                  </div>
              ))}
            </div>
          </section>

          <section className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
            <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {featuredItems.map((item) => (
                  <div
                      key={item.id}
                      className="card bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
                  >
                    <p className="text-gray-600">{item.description}</p>
                  </div>
              ))}
            </div>
          </section>
        </main>

        <footer id="footer" className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex sm:flex-col lg:flex-row items-center justify-between">
            <div className="contact-info text-l font-bold mb-4 sm:mb-0">
              <Link href="/" aria-label="Home">
                Contact: info@example.com
              </Link>
            </div>
            <div id="nav-links" className="social-media-links flex sm:flex-col lg:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="#facebook" className="hover:text-gray-400">Facebook</Link>
              <Link href="#twitter" className="hover:text-gray-400">X</Link>
              <Link href="#insta" className="hover:text-gray-400">Instagram</Link>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default HomePage;