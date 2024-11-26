'use client';

import React, { useState } from 'react';
import Navbar from "@/app/components/Navbar/Navbar";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        avatar: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // Redirect to login page if registration is successful
                console.log('User registered:', data);
            } else {
                console.error('Registration failed:', data.error);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Phone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="avatar" className="block text-sm font-medium mb-1">
                                Avatar URL
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="text"
                                value={formData.avatar}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
