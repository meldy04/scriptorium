'use client';

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from 'react';
import CodeEditor from "@/app/components/CodeEditor/CodeEditor";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

const EditorPage = () => {
    const pathname = usePathname();
    const templateId = pathname.split("/").pop();

    const [templateCode, setTemplateCode] = useState('');
    const [templateLanguage, setTemplateLanguage] = useState('python');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplate = async () => {
            console.log('Fetching template for ID:', templateId);
            try {
                if (templateId) {
                    const response = await fetch(`/api/templates/${templateId}`);
                    if (response.ok) {
                        const template = await response.json();
                        console.log('Fetched Template:', template);
                        setTemplateCode(template.code);
                        console.log('Template Code Set:', template.code);
                        setTemplateLanguage(template.language);
                    } else {
                        console.error('Template not found');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch template:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    useEffect(() => {
        console.log('Setting initial props:', templateCode, templateLanguage);
    }, [templateCode, templateLanguage]);

    return (
        <div>
            <Navbar />
            <h1>Code Editor</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <CodeEditor initialCode={templateCode} initialLanguage={templateLanguage} />
            )}
            <Footer />
        </div>
    );
};

export default EditorPage;