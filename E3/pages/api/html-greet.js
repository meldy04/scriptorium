export default function handler(req, res) {
    const { name } = req.query;

    if(name) {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <body>
                <h1>Hello, ${name}!</h1>
                <p>This is a personalised HTML response.</p>
            </body>
            </html>
            `);
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <body>
                <h1>Hello, World!</h1>
                <p>This is a default HTML response.</p>
            </body>
            </html>
            `);
    }
}