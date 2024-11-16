import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';

function getCompileCommand(language, filePath, inputFilePath) {
    switch (language) {
        case 'C':
            return `gcc ${filePath} -o ${filePath}.out && ${filePath}.out < ${inputFilePath}`;
        case 'CPP':
            return `g++ ${filePath} -o ${filePath}.out && ${filePath}.out < ${inputFilePath}`;
        case 'JAVA':
            return `javac ${filePath} && java -cp /tmp Main < ${inputFilePath}`;
        case 'PYTHON':
            return `python3 ${filePath} < ${inputFilePath}`;
        case 'JAVASCRIPT':
            return `node ${filePath} < ${inputFilePath}`;
        default:
            throw new Error('Unsupported language');
    }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { language, code, input } = req.body;

        // Temp files for code and input
        const fileName = `code.${language.toLowerCase()}`;
        const inputFileName = 'input.txt';
        const filePath = path.join('/tmp', fileName);
        const inputFilePath = path.join('/tmp', inputFileName);

        try {
            writeFileSync(filePath, code);
            writeFileSync(inputFilePath, input || '');

            const compileCommand = getCompileCommand(language, filePath, inputFilePath);
            const output = execSync(compileCommand, { timeout: 5000 });
            res.status(200).json({ output: output.toString() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}