import React, { useState } from "react";

const FlexPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            {/* Navbar */}
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
                    <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                    <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
                    <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero-section" className="flex items-center justify-center h-screen bg-gray-600 text-white text-center">
                <div>
                    <h1 className="hero-title text-4xl font-bold mb-4">Welcome to Our Website!</h1>
                    <button className="hero-button px-6 py-3 bg-blue-500 text-white rounded">Get Started</button>
                </div>
            </section>
        </div>
    );
};

export default FlexPage;
