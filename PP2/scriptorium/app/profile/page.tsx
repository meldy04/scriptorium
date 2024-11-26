'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/Navbar/Navbar";

const EditProfilePage = () => {
    const { user } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            // Pre-populate form fields with current user data as placeholders
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setAvatar(user.avatar || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updatedProfile = {
            userId: user?.id,
            firstName,
            lastName,
            avatar,
            phone
        };

        try {
            const response = await fetch('/api/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setLoading(false);
            router.push('/profile');
        } catch (error: unknown) {
            setLoading(false);
            setError((error as Error).message || 'An error occurred');
        }
    };

    // Enable editing mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Disable editing without saving
    const handleCancelClick = () => {
        setIsEditing(false);
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        setAvatar(user?.avatar || '');
        setPhone(user?.phone || '');
    };

    if (!user) {
        return <p>You need to be logged in to edit your profile.</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder={isEditing ? '' : firstName || 'Enter your first name'}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder={isEditing ? '' : lastName || 'Enter your last name'}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block">Avatar URL</label>
                        <input
                            type="text"
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder={isEditing ? '' : avatar || 'Enter your avatar URL'}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder={isEditing ? '' : phone || 'Enter your phone number'}
                            readOnly={!isEditing}
                        />
                    </div>

                    {/* Edit/Save buttons */}
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
