import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';

function getDockerRunCommand(language, codeFile, inputFile) {
    const dockerImages = {
        C: 'gcc:latest',
        CPP: 'gcc:latest',
        JAVA: 'openjdk:latest',
        PYTHON: 'python:3.10-slim',
        JAVASCRIPT: 'node:16-slim',
    };

    const compileCommands = {
        C: 'gcc /code/code.c -o /code/code.out && /code/code.out < /code/input.txt',
        CPP: 'g++ /code/code.cpp -o /code/code.out && /code/code.out < /code/input.txt',
        JAVA: 'javac /code/Main.java && java -cp /code Main < /code/input.txt',
        PYTHON: 'python3 /code/code.py < /code/input.txt',
        JAVASCRIPT: 'node /code/code.js < /code/input.txt'
    };

    const image = dockerImages[language];
    const command = compileCommands[language];
    if(!image || !command) {
        throw new Error('Unsupported language');
    }

    return `docker run --rm \
        --cpus="0.5" \
        --memory="512m" \
        -v ${codeFile}:/code/code \
        -v ${inputFile}:/code/input.txt \
        ${image} sh -c "${command}"`;
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

            const compileCommand = getDockerRunCommand(language, filePath, inputFilePath);
            const output = execSync(compileCommand, { timeout: 5000 });
            res.status(200).json({ output: output.toString() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}