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
        <header>
          <nav id="navbar" className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="text-2xl font-bold">
                <Link href="/" aria-label="Home">
                  Logo
                </Link>
              </div>
              <div id="nav-links" className="hidden md:flex space-x-6">
                <Link href="#authors" className="hover:text-gray-400">Authors</Link>
                <Link href="#stores" className="hover:text-gray-400">Stores</Link>
                <Link href="#books" className="hover:text-gray-400">Books</Link>
                <Link href="#contact" className="hover:text-gray-400">Contact</Link>
              </div>
              <button
                  onClick={toggleMenu}
                  id="hamburger-menu"
                  className="md:hidden p-2 rounded bg-gray-700 hover:bg-gray-600"
                  aria-label="Toggle Menu"
              >
                <div className="w-5 h-1 bg-white mb-1"></div>
                <div className="w-5 h-1 bg-white mb-1"></div>
                <div className="w-5 h-1 bg-white"></div>
              </button>
            </div>

            {isMenuOpen && (
                <div id="nav-links-sm" className="md:hidden flex flex-col mt-2 space-y-2 px-4 pb-4 bg-gray-700">
                  <Link href="#home" className="hover:text-gray-400">Home</Link>
                  <Link href="#about" className="hover:text-gray-400">About</Link>
                  <Link href="#services" className="hover:text-gray-400">Services</Link>
                  <Link href="#contact" className="hover:text-gray-400">Contact</Link>
                </div>
            )}
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
            <div className="text-l font-bold mb-4 sm:mb-0">
              <Link href="/" aria-label="Home">
                Contact: info@example.com
              </Link>
            </div>
            <div id="nav-links" className="flex sm:flex-col lg:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
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
