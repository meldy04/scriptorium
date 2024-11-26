'use client';

import NavBar from "@/app/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Template {
    id: number;
    title: string;
    explanation: string;
    tags: string[];
    language: string;
    code: string;
    createdAt: string;
}

const TemplatesPage = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchTemplates = React.useCallback(async () => {
        try {
            const response = await axios.get("/api/templates/list", {
                params: { search, tags, page, limit: 10 },
            });
            const { templates, pagination } = response.data;

            setTemplates(templates);
            setTotalPages(Math.ceil(pagination.total / pagination.limit));
        } catch {
            setError("Failed to fetch templates.");
        }
    }, [search, tags, page]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        fetchTemplates();
    };

    return (
        <div>
            <NavBar />
            <div className="min-h-screen flex flex-col items-center p-4">
                <h1 className="text-3xl mb-6">Templates</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSearch} className="mb-4 w-full max-w-2xl flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </form>
                <div className="space-y-4 w-full max-w-4xl">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="border p-4 rounded-lg bg-white shadow"
                        >
                            <h2 className="text-xl font-semibold">{template.title}</h2>
                            <p className="text-gray-600">{template.explanation}</p>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    Tags: {template.tags.join(", ")}
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    Language: {template.language}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-6 w-full max-w-4xl">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatesPage;
