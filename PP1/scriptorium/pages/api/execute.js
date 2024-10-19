import { exec } from 'child_process';

export default function handler(req, res) {
    const { code, language, stdin } = req.body;

    const compileCommand = getCompileCommand(language, code);
    exec(compileCommand, (error, stdout, stderr) => {
        if(error) {
            res.status(400).json({ error: stderr });
        } else {
            res.status(200).json({ output: stdout });
        }
    });

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
}