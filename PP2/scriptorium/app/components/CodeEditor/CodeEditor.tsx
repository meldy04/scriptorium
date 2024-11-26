'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here...');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language, code, input }),
            });

            const result = await response.json();

            if (response.ok) {
                setOutput(result.output || 'No output');
            } else {
                setOutput(result.error || 'Error executing code');
            }
        } catch (error) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`);
            } else {
                setOutput('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
            </select>
            <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
            />
            <textarea
                placeholder="Input for your program..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleRun} disabled={loading}>
                {loading ? 'Running...' : 'Run'}
            </button>
            <pre>{output}</pre>
        </div>
    );
};

export default CodeEditor;
