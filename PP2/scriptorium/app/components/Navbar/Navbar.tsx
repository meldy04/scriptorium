'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/app/context/AuthContext";
import {useRouter} from "next/navigation";

const NavBar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/'); // Redirect to homepage
    };

    return (
        <nav className="bg-gray-600 border-b border-gray-300 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link className="text-xl font-bold" href="/">Scriptorium</Link>

                {/* Hamburger Icon for small screens */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="">
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                    <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/blogs" className="hover:underline">Blogs</Link>
                    <Link href="/templates" className="hover:underline">Templates</Link>

                    {/* Profile Icon with Dropdown for larger screens */}
                    {user && (
                        <div className="relative group">
                            {/* Profile Icon */}
                            <button className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zM12 14c-3.314 0-6 2.686-6 6v2h12v-2c0-3.314-2.686-6-6-6z"></path>
                                </svg>
                            </button>

                            {/* Profile Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:block transition-opacity">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                <Link href="/blogs/my-blogs" className="block px-4 py-2 hover:bg-gray-100">
                                    Manage Blogs
                                </Link>
                                <Link href="/templates/my-templates" className="block px-4 py-2 hover:bg-gray-100">
                                    Manage Templates
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Login Link if not logged in */}
                    {!user && (
                        <Link href="/login" className="hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
