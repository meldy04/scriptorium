'use client';

import React from 'react';
import ThemeSwitch from "@/app/components/ThemeSwitch/ThemeSwitcher";
const Footer = () => {

    return (
        <footer className="sticky bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-600 text-black dark:text-white p-4 flex justify-center items-center shadow-lg">
            <ThemeSwitch />
        </footer>
    );
};

export default Footer;
