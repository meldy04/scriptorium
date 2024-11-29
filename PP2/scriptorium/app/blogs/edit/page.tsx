'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {useParams, useRouter} from 'next/navigation';
import axios from 'axios';
import NavBar from "@/app/components/Navbar/Navbar";

interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    tags: string;
    templateIds: number[];
}

const EditBlogPage = () => {
    const params = useParams();
    const blogId = params.id;
    const { token } = useAuth();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [templateIds, setTemplateIds] = useState<number[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!token) return;

            try {
                const response = await axios.get(`/api/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const blogData: Blog = response.data;
                setBlog(blogData);
                setTitle(blogData.title);
                setDescription(blogData.description);
                setContent(blogData.content);
                setTags(blogData.tags);
                setTemplateIds(blogData.templateIds || []);
            } catch (error) {
                setError('Failed to fetch the blog data.');
                console.error(error);
            }
        };

        fetchBlog();
    }, [token, blogId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!token) {
            setError('You must be logged in to edit a blog');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.put(
                `/api/blogs/edit`,
                {
                    id: blogId,
                    title,
                    description,
                    content,
                    tags,
                    templateIds,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            router.push(`/blogs/${response.data.id}`);
        } catch {
            setError('An error occurred while updating the blog');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Edit Blog</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {blog ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Templates</label>
                            <input
                                type="text"
                                value={templateIds.join(', ')}
                                onChange={(e) => setTemplateIds(e.target.value.split(',').map(id => parseInt(id.trim())))}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md dark:text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Blog'}
                        </button>
                    </form>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default EditBlogPage;