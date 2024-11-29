'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import NavBar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

const CreateBlogPage = () => {
    const { token } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [templateIds, setTemplateIds] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Ensure the token is available
        if (!token) {
            setError('You must be logged in to create a blog');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/blogs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    content,
                    tags,
                    templateIds,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create blog post');
            }

            const data = await response.json();
            setSuccess(`Blog post \"${data.title}\" created successfully!`);
            router.push('/blogs/my-blogs');
        } catch {
            setError('An error occurred while creating the blog');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Create a New Blog</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Templates</label>
                        <input
                            type="text"
                            value={templateIds.join(', ')}
                            onChange={(e) => setTemplateIds(e.target.value.split(',').map(id => parseInt(id.trim())))}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            placeholder="Enter template IDs"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Blog'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreateBlogPage;