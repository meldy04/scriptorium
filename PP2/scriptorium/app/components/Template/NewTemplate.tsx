import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

interface Template {
    id: number;
    title: string;
    explanation: string;
    tags: string;
    code: string;
    language: string;
    createdAt: string;
}

interface SaveTemplateFormProps {
    onTemplateSaved?: (newTemplate: Template) => void;
    initialCode: string;
}

const SaveTemplateForm: React.FC<SaveTemplateFormProps> = ({ onTemplateSaved, initialCode }) => {
    const [isForked] = useState(false);
    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [tags, setTags] = useState('');
    const [code, setCode] = useState(initialCode);
    const [language] = useState('python');
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const handleSaveTemplate = async () => {
        try {
            const response = await axios.post(
                '/api/templates/create',
                { title, explanation, tags, code, language, isForked },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 201) {
                alert('Template saved successfully!');
                if (onTemplateSaved) {
                    onTemplateSaved(response.data);
                }
            }
        } catch {
            setError('Failed to save template');
        }
    };

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    return (
        <div>
            <h2>Save Code as Template</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <input value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Explanation" required />
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" required />
            <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" required />
            <button onClick={handleSaveTemplate}>Save Template</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SaveTemplateForm;