import { NextResponse } from 'next/server';
import { exec } from 'child_process';

const images = {
    python: 'python:3.13.0rc2-alpine3.20',
    cpp: 'bellsoft/alpaquita-linux-gcc:14.2-musl',
    java: 'openjdk:17-alpine',
    javascript: 'node:22-alpine3.19',
    c: 'bellsoft/alpaquita-linux-gcc:14.2-musl',
};

// Execute shell commands
const execShellCommand = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(`Executing command: ${cmd}`);
        exec(cmd, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error("Error: ", stderr || error.message);
                reject(stderr || error.message);
            } else {
                console.log(`Command output: ${stdout}`);
                resolve(stdout);
            }
        });
    });
};

// API handler
export async function POST(request: Request) {
    try {
        const { language, code, input } = await request.json();

        if (!language || !code) {
            return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
        }

        const imageName = images[language];
        if (!imageName) {
            return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
        }

        // Encode the code to Base64
        const base64Code = Buffer.from(code).toString('base64');
        let command;

        switch (language) {
            case 'python':
                command = `sh -c "echo '${base64Code}' | base64 -d > program.py && python3 program.py '${input}'"`;
                break;
            case 'cpp':
                command = `sh -c "echo '${base64Code}' | base64 -d > program.cpp && g++ -o program program.cpp && echo '${input}' | ./program"`;
                break;
            case 'java':
                command = `sh -c "echo '${base64Code}' | base64 -d > Main.java && javac Main.java && echo '${input}' | java Main"`;
                break;
            case 'javascript':
                command = `sh -c "echo '${base64Code}' | base64 -d > program.js && INPUT='${input}' node program.js"`;
                break;
            case 'c':
                command = `sh -c "echo '${base64Code}' | base64 -d > program.c && gcc -o program program.c && echo '${input}' | ./program"`;
                break;
            default:
                throw new Error('Unsupported language');
        }

        const dockerCommand = `docker run --rm ${imageName} ${command}`;
        console.log(`Docker Command: ${dockerCommand}`);

        // Execute the Docker command
        const output = await execShellCommand(dockerCommand);

        return NextResponse.json({ output });
    } catch (error) {
        console.error('Execution error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
