import React, { useState } from "react";
import axios from "axios";

const NewTemplate = ({ onClose }: { onClose: () => void }) => {
    const [title, setTitle] = useState("");
    const [explanation, setExplanation] = useState("");
    const [tags, setTags] = useState("");
    const [language, setLanguage] = useState("JavaScript");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("/api/templates/create", {
                title,
                explanation,
                tags: tags.split(",").map(tag => tag.trim()),
                language,
                code,
            });
            onClose();
        } catch {
            setError("Failed to save template.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Create New Template</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <textarea
                        placeholder="Explanation"
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>
                    </select>
                    <textarea
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTemplate;
