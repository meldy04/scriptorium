'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import NavBar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

interface Template {
    id: number;
    title: string;
    explanation: string;
    tags: string;
    code: string;
    language: string;
    isPublic: boolean;
}

const MyTemplatesPage = () => {
    const { token } = useAuth();
    const router = useRouter();

    const [templates, setTemplates] = useState<Template[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

    const templatesPerPage = 9;

    const fetchTemplates = useCallback(async () => {
        if (!token) return;

        try {
            const response = await axios.get('/api/templates/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTemplates(response.data);
            setFilteredTemplates(response.data);
        } catch {
            setError('Failed to fetch your templates.');
        }
    }, [token]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    useEffect(() => {
        const filtered = templates.filter(template =>
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTemplates(filtered);
        setCurrentPage(1);
    }, [searchQuery, templates]);

    const handleOpenInEditor = (template: Template) => {
        const editorUrl = `/editor/${template.id}`;
        router.push(editorUrl);
        console.log('Navigating to:', editorUrl);
    };

    const handleEdit = (template: Template) => {
        setCurrentTemplate(template);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!token) return;

        try {
            await axios.delete(`/api/templates/delete`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { id }
            });

            setTemplates(templates.filter(template => template.id !== id));
            setFilteredTemplates(filteredTemplates.filter(template => template.id !== id));
        } catch {
            setError('Failed to delete template.');
        }
    };

    const handleUpdate = async () => {
        if (!token || !currentTemplate) return;

        try {
            const response = await axios.put(`/api/templates/${currentTemplate.id}`, currentTemplate, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const updatedTemplate = response.data;
            setTemplates(templates.map(template => template.id === currentTemplate.id ? updatedTemplate : template));
            setFilteredTemplates(filteredTemplates.map(template => template.id === currentTemplate.id ? updatedTemplate : template));
            setIsEditing(false);
            setCurrentTemplate(null);
        } catch {
            setError('Failed to update template.');
        }
    };

    const toggleTemplatePrivacy = async (template: Template) => {
        if (!token) return;

        try {
            const updatedTemplate = { ...template, isPublic: !template.isPublic };
            await axios.put(`/api/templates/${template.id}`, updatedTemplate, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            setTemplates(templates.map(t => t.id === template.id ? updatedTemplate : t));
            setFilteredTemplates(filteredTemplates.map(t => t.id === template.id ? updatedTemplate : t));
        } catch {
            setError('Failed to toggle template privacy.');
        }
    };

    const indexOfLastBlog = currentPage * templatesPerPage;
    const indexOfFirstBlog = indexOfLastBlog - templatesPerPage;
    const currentTemplates = templates.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(templates.length / templatesPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Your Templates</h1>
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 p-2 border rounded"
                />
                {error && <p className="text-red-500">{error}</p>}
                {filteredTemplates.length === 0 ? (
                    <p>No templates found.</p>
                ) : (
                    <div className="space-y-4">
                        {filteredTemplates.map((template) => (
                            <div key={template.id} className="p-4 border rounded-lg shadow-md">
                                <h2 className="text-xl font-bold">{template.title}</h2>
                                <p className="text-gray-600">{template.explanation}</p>
                                <p className="text-gray-500"><strong>Tags:</strong> {template.tags}</p>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => handleOpenInEditor(template)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Open in Editor
                                    </button>
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => toggleTemplatePrivacy(template)}
                                        className={`px-4 py-2 ${template.isPublic ? 'bg-green-500' : 'bg-gray-500'} text-white rounded hover:${template.isPublic ? 'bg-green-700' : 'bg-gray-700'}`}
                                    >
                                        {template.isPublic ? 'Make Private' : 'Make Public'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="pagination flex justify-center mt-6">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded mr-2"
                            >
                                Previous
                            </button>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {isEditing && currentTemplate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">Edit Template</h2>
                            <input
                                type="text"
                                value={currentTemplate.title || ''}
                                onChange={(e) => setCurrentTemplate({...currentTemplate, title: e.target.value})}
                                className="mb-4 p-2 w-full border rounded"
                                placeholder="Title"
                            />
                            <textarea
                                value={currentTemplate.explanation || ''}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, explanation: e.target.value })}
                                className="mb-4 p-2 w-full border rounded"
                                placeholder="Explanation"
                            />
                            <input
                                type="text"
                                value={currentTemplate.tags || ''}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, tags: e.target.value })}
                                className="mb-4 p-2 w-full border rounded"
                                placeholder="Tags"
                            />
                            <textarea
                                value={currentTemplate.code || ''}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, code: e.target.value })}
                                className="mb-4 p-2 w-full border rounded"
                                placeholder="Code"
                            />
                            <input
                                type="text"
                                value={currentTemplate.language || ''}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, language: e.target.value })}
                                className="mb-4 p-2 w-full border rounded"
                                placeholder="Language"
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyTemplatesPage;