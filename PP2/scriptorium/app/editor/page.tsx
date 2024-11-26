import React from 'react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import Navbar from "@/app/components/Navbar/Navbar";

const EditorPage = () => {
    return (
        <div className="relative">
            <Navbar />
            <div className="pt-16">
                <h1>Online Code Editor</h1>
                <CodeEditor />
            </div>
        </div>
    );
};

export default EditorPage;
