'use client';

import React from 'react';
import NavBar from "@/app/components/Navbar/Navbar";
import CodeEditor from '../app/components/CodeEditor/CodeEditor';
import "./globals.css";
import Footer from "@/app/components/Footer/Footer";

const HomePage = () => {
    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center">Welcome to Scriptorium</h1>
                <p className="text-center mt-4">Write, execute, and manage your code templates with ease.</p>

                <div className="mt-12">
                    <h2 className="text-2xl">Try out the editor below:</h2>
                    <CodeEditor />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
