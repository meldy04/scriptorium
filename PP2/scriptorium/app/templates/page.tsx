'use client';

import React, { useState, useEffect } from 'react';
import NavBar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import {useRouter} from "next/navigation";

interface Template {
    id: number;
    title: string;
    explanation: string;
    language: string;
    code: string;
    tags: string;
    user: {
        firstName: string;
    };
}

function TemplateCard({ template }: { template: Template }) {
    const router = useRouter();

    const handleUseTemplate = () => {
        const editorUrl = `/editor/${template.id}`;
        router.push(editorUrl);
        console.log('Navigating to:', editorUrl); // Log the navigation URL
    };

    return (
        <div className="border p-4 rounded-lg shadow-md ">
            <h2 className="text-xl">{template.title}</h2>
            <p className="">By {template.user.firstName}</p>
            <p className="mt-2">{template.explanation.substring(0, 150)}...</p>
            <p className="mt-2 text-sm">Language: {template.language}</p>
            <p className="mt-2 text-sm">Code: {template.code}</p>
            <p className="mt-2 text-sm">Tags: {template.tags}</p>
            <button
                onClick={handleUseTemplate}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Use Template
            </button>
        </div>
    );
}

const TemplatesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const templatesPerPage = 9;

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const response = await fetch(`/api/templates?searchQuery=${encodeURIComponent(searchQuery)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setTemplates(data);
                        setCurrentPage(1);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            }
        };

        loadTemplates();
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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
                <h1 className="text-4xl font-bold mb-6">Templates</h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by title, tags, or content..."
                    className="border p-2 mb-4 w-full"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {// Use currentTemplates instead of templates
                        currentTemplates.map((template) => (
                            <TemplateCard key={template.id} template={template}/>
                        ))}
                </div>
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
            <Footer/>
        </div>
    );
};

export default TemplatesPage;