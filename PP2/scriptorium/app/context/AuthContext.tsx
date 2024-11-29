'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: number;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    phone: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Check if token exists in localStorage
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        console.log('Saved Token:', savedToken);
        console.log('Saved User:', savedUser);

        if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (isUser(parsedUser)) {
                setToken(savedToken);
                setUser(parsedUser);
                console.log('User set from localStorage:', parsedUser);
            } else {
                console.warn("Invalid user data in localStorage");
            }
        }
    }, []);

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        console.log('Logging in with:', token, user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        console.log('Logged out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const isUser = (user: unknown): user is User => {
    return (
        typeof user === 'object' &&
        user !== null &&
        'id' in user &&
        'email' in user &&
        'role' in user &&
        typeof (user as User).id === 'number' &&
        typeof (user as User).email === 'string' &&
        typeof (user as User).role === 'string' &&
        (typeof (user as User).firstName === 'string' || (user as User).firstName === null) &&
        (typeof (user as User).lastName === 'string' || (user as User).lastName === null) &&
        (typeof (user as User).avatar === 'string' || (user as User).avatar === null) &&
        (typeof (user as User).phone === 'string' || (user as User).phone === null)
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};