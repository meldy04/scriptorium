import React, { useState } from "react";
import Link from "next/link";

const FlexPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            {/* Navbar */}
            <nav id="navbar" className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="text-2xl font-bold">
                        <Link href="/" aria-label="Home">
                            Logo
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div id="nav-links" className="hidden md:flex space-x-6">
                        <Link href="#home" className="hover:text-gray-400">
                            Home
                        </Link>
                        <Link href="#about" className="hover:text-gray-400">
                            About
                        </Link>
                        <Link href="#services" className="hover:text-gray-400">
                            Services
                        </Link>
                        <Link href="#contact" className="hover:text-gray-400">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        id="hamburger-menu"
                        className="md:hidden p-2 rounded bg-gray-700 hover:bg-gray-600"
                        aria-label="Toggle Menu"
                    >
                        {/* Hamburger Icon for Mobile */}
                        <div className="w-5 h-1 bg-white mb-1"></div>
                        <div className="w-5 h-1 bg-white mb-1"></div>
                        <div className="w-5 h-1 bg-white"></div>
                    </button>
                </div>

                {/* Mobile Menu Links */}
                <div
                    id="nav-links-sm"
                    className={`md:hidden flex flex-col mt-2 space-y-2 px-4 pb-4 bg-gray-700 transition-all duration-300 ease-in-out ${
                        isMenuOpen ? "block" : "hidden"
                    }`}
                >
                    <Link href="#home" className="hover:text-gray-400">
                        Home
                    </Link>
                    <Link href="#about" className="hover:text-gray-400">
                        About
                    </Link>
                    <Link href="#services" className="hover:text-gray-400">
                        Services
                    </Link>
                    <Link href="#contact" className="hover:text-gray-400">
                        Contact
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div id="hero-section" className="relative isolate px-6 pt-14 lg:px-8 flex justify-center items-center">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="hero-title text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                            Welcome to Our Website
                        </h1>

                        <div className="hero-button mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>
        </div>
    );
};

export default FlexPage;
