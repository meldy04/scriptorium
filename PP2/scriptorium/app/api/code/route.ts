import { NextResponse } from 'next/server';
import { exec } from 'child_process';

const images: Record<string, string> = {
    python: 'python:3.13.0rc2-alpine3.20',
    javascript: 'node:22-alpine3.19',
    java: 'openjdk:17-jdk-slim',
    cpp: 'bellsoft/alpaquita-linux-gcc:14.2-musl',
    c: 'bellsoft/alpaquita-linux-gcc:14.2-musl',
    ruby: 'ruby:3.2-alpine',
    go: 'golang:1.21',
    rust: 'rust:1.72-slim',
    php: 'php:8.2-cli',
    perl: 'perl:5.36',
    swift: 'swift:5.9',
    kotlin: 'openjdk:17-jdk-slim',
    bash: 'bash:latest',
    typescript: 'node:22-alpine3.19',
    r: 'r-base:4.3.0',
};

const getExecutionCommand = (language: string, code: string, input: string): string => {
    const base64Code = Buffer.from(code).toString('base64');
    switch (language) {
        case 'python':
            return `sh -c "echo '${base64Code}' | base64 -d > program.py && echo '${input}' | python3 program.py"`;
        case 'javascript':
            return `sh -c "echo '${base64Code}' | base64 -d > program.js && echo '${input}' | node program.js"`;
        case 'java':
            return `sh -c "echo '${base64Code}' | base64 -d > Main.java && javac Main.java && echo '${input}' | java Main"`;
        case 'cpp':
            return `sh -c "echo '${base64Code}' | base64 -d > program.cpp && g++ -o program program.cpp && echo '${input}' | ./program"`;
        case 'c':
            return `sh -c "echo '${base64Code}' | base64 -d > program.c && gcc -o program program.c && echo '${input}' | ./program"`;
        case 'ruby':
            return `sh -c "echo '${base64Code}' | base64 -d > program.rb && echo '${input}' | ruby program.rb"`;
        case 'go':
            return `sh -c "echo '${base64Code}' | base64 -d > main.go && echo '${input}' | go run main.go"`;
        case 'rust':
            return `sh -c "echo '${base64Code}' | base64 -d > main.rs && rustc main.rs && echo '${input}' | ./main"`;
        case 'php':
            return `sh -c "echo '${base64Code}' | base64 -d > program.php && echo '${input}' | php program.php"`;
        case 'perl':
            return `sh -c "echo '${base64Code}' | base64 -d > program.pl && echo '${input}' | perl program.pl"`;
        case 'swift':
            return `sh -c "echo '${base64Code}' | base64 -d > program.swift && echo '${input}' | swift program.swift"`;
        case 'kotlin':
            return `sh -c "echo '${base64Code}' | base64 -d > Main.kt && kotlinc Main.kt -include-runtime -d Main.jar && echo '${input}' | java -jar Main.jar"`;
        case 'bash':
            return `sh -c "echo '${base64Code}' | base64 -d > program.sh && echo '${input}' | bash program.sh"`;
        case 'typescript':
            return `sh -c "echo '${base64Code}' | base64 -d > program.ts && echo '${input}' | npx ts-node program.ts"`;
        case 'r':
            return `sh -c "echo '${base64Code}' | base64 -d > program.R && echo '${input}' | Rscript program.R"`;
        default:
            throw new Error('Unsupported language');
    }
};

const execShellCommand = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(`Executing command: ${cmd}`);
        exec(cmd, { timeout: 15000 }, (error, stdout, stderr) => {
            if (error || stderr) {
                const errorMessage = `${stderr || ''}\n${stdout || ''}\n${error ? error.message : ''}`;
                console.error("Error: ", errorMessage);
                reject(errorMessage.trim());
            } else {
                console.log(`Command output: ${stdout}`);
                resolve(stdout);
            }
        });
    });
};

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

        const command = getExecutionCommand(language, code, input);
        const dockerCommand = `docker run --rm ${imageName} ${command}`;
        console.log(`Docker Command: ${dockerCommand}`);

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