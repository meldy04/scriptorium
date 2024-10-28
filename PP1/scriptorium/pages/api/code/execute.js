export default async function handler(req, res) {
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
        res.status(405).json({ error: 'Method not allowed'});
    }
}