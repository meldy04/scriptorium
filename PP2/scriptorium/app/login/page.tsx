'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/app/components/Navbar/Navbar";
import { User } from "@prisma/client";

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Attempting login with:', { email, password });

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const { token, user } = await response.json();

            const fullUser: Omit<User, 'password'> = {
                id: user.id,
                email: user.email,
                role: user.role || 'USER',
                firstName: user.firstName ?? null,
                lastName: user.lastName ?? null,
                avatar: user.avatar ?? null,
                phone: user.phone ?? null,
            };

            login(token, fullUser);
            // Redirect to homepage
            router.push('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
                </form>
                <p className="text-sm mt-4 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
