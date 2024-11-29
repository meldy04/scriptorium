'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NavBar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

interface Blog {
    id: string;
    title: string;
    description: string;
    votes: number;
    comments: { id: string; text: string; isHidden: boolean }[];
    isHidden: boolean;
    user: { id: string; firstName: string };
}

const MyBlogsPage = () => {
    const { token } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!token) return;

            try {
                const response = await axios.get('/api/blogs/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBlogs(response.data);
            } catch {
                setError('Failed to fetch your blogs.');
            }
        };

        fetchBlogs();
    }, [token]);

    const handleEdit = (blogId: string) => {
        router.push(`/blogs/edit/${blogId}`);
    };

    const handleDelete = async (blogId: string) => {
        if (!token) return;

        try {
            console.log(`Deleting blog with id: ${blogId}`);
            await axios.delete('/api/blogs/delete', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                data: { id: blogId },
            });
            setBlogs(blogs.filter((blog) => blog.id !== blogId));
        } catch (error) {
            setError('Failed to delete the blog.');
            console.error(error);
        }
    };

    const handleCreate = () => {
        router.push('/blogs/create');
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Manage Your Blogs</h1>

                <button
                    onClick={handleCreate}
                    className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                    Create New Blog
                </button>

                {error && <p className="text-red-500">{error}</p>}

                {blogs.length === 0 ? (
                    <p>You have no blogs yet.</p>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="p-4 border rounded-lg shadow-md bg-white">
                                <h2 className="text-xl font-bold">{blog.title}</h2>
                                <p className="text-gray-600">{blog.description}</p>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => handleEdit(blog.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyBlogsPage;