import { execSync } from 'child_process';

// Write code into appropriate temporary file then compile
function getCompileCommand(language, code) {
    switch (language) {
        case 'C':
            return `echo "${code}" > /tmp/code.c && gcc /tmp/code.c -o /tmp/code && /tmp/code`;
        case 'CPP':
            return `echo "${code}" > /tmp/code.cpp && g++ /tmp/code.cpp -o /tmp/code && /tmp/code`;
        case 'JAVA':
            return `echo "${code}" > /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main`;
        case 'PYTHON':
            return `echo "${code}" > /tmp/code.py && python3 /tmp/code.py`;
        case 'JAVASCRIPT':
            return `echo "${code}" > /tmp/code.js && node /tmp/code.js`;
        default:
            throw new Error('Unsupported language');
    }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { language, code, input } = req.body;

        const compileCommand = getCompileCommand(language, code);
        try {
            const output = execSync(compileCommand + `<<< "${input}"`);
            res.status(200).json({ output: output.toString() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(200).json({ output: stdout });
    }
}