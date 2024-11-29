import { FaPlay, FaFloppyDisk } from 'react-icons/fa6';
import Editor from '@monaco-editor/react';
import React, {useEffect, useState} from 'react';
import { useTheme } from 'next-themes';
import SaveTemplateForm from "@/app/components/Template/NewTemplate";

interface CodeEditorProps {
    initialCode?: string;
    initialLanguage?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, initialLanguage }) => {
    const { theme } = useTheme();
    const [code, setCode] = useState('# Scriptorium - Code Editor, Compiler, Interpreter\n\nprint(\'Welcome to Scriptorium!! Happy Coding :)\')');
    const [language, setLanguage] = useState('python');

    useEffect(() => {
        console.log('Updating code and language:', initialCode, initialLanguage);
        if (initialCode !== undefined) {
            setCode(initialCode);
        }
        if (initialLanguage !== undefined) {
            setLanguage(initialLanguage);
        }
    }, [initialCode, initialLanguage]);

    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSaveTemplate, setShowSaveTemplate] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setOutput('');
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
                setOutput(`Error executing code:\n${result.error}` || 'Error executing code');
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
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border px-4 py-2 rounded border-gray-300 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-400"
                >
                    {/* Language options */}
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                    <option value="perl">Perl</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="bash">Bash</option>
                    <option value="typescript">TypeScript</option>
                    <option value="r">R</option>
                </select>
                <button
                    onClick={() => setShowSaveTemplate(true)}
                    className="flex items-center space-x-2 px-4 py-2 border rounded border-gray-300 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-400"
                >
                    {showSaveTemplate ? 'Cancel' : <><FaFloppyDisk /> Save as Template</>}
                </button>
            </div>

            <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                className="rounded border-white dark:border-gray-700"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
            />

            <div className="flex items-center space-x-4 mt-4">
                <button
                    className="text-green-700 flex items-center space-x-2 px-4 py-2 border rounded border-gray-300 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-400"
                    onClick={handleRun}
                    disabled={loading}
                >
                    {loading ? 'Running...' : <><FaPlay /> Run</>}
                </button>
                <textarea
                    className="flex-grow px-4 py-2 border rounded border-gray-300 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-400 resize-none"
                    style={{ height: "calc(2.1rem * 1.25)" }}
                    placeholder="Input for your program..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <pre className="mt-4">{output}</pre>

            {showSaveTemplate && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg relative mx-4 w-full max-w-md">
                        <button className="absolute top-3 right-3 text-gray-600 text-xl" onClick={() => setShowSaveTemplate(false)}>
                            &times;
                        </button>
                        <SaveTemplateForm onTemplateSaved={() => setShowSaveTemplate(false)} initialCode={code} />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowSaveTemplate(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;