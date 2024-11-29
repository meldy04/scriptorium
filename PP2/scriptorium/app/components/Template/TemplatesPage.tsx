import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

interface Template {
    id: number;
    title: string;
    explanation: string;
    tags: string;
    createdAt: string;
}

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('/api/templates', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTemplates(response.data);
                setFilteredTemplates(response.data);
            } catch (error) {
                console.error('Failed to fetch templates', error);
            }
        };

        fetchTemplates();
    }, [token]);

    useEffect(() => {
        const filtered = templates.filter(template =>
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.explanation.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTemplates(filtered);
    }, [searchTerm, templates]);

    return (
        <div>
            <h1>My Templates</h1>
            <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredTemplates.map((template) => (
                    <li key={template.id}>
                        <h3>{template.title}</h3>
                        <p>{template.explanation}</p>
                        <p><b>Tags:</b> {template.tags}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TemplatesPage;