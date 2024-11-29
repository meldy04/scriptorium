"use client";

import { HiOutlineSun as SunIcon, HiOutlineMoon as MoonIcon } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => setMounted(true), []);

    if (!mounted) return <>...</>;

    return (
        <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
        >
            {currentTheme === "dark" ? (
                <SunIcon className="h-6 w-6 text-white" />
            ) : (
                <MoonIcon className="h-6 w-6 text-white" />
            )}
        </button>
    );
}