export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} not allowed`);
    }

    const { name, age, preferences } = req.body;

    // Check required fields are provided
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Missing field: name" });
    }
    if (typeof age !== 'number' || isNaN(age)) {
        return res.status(400).json({ error: "Missing field: age" });
    }
    if (typeof preferences !== 'object' || preferences === null) {
        return res.status(400).json({ error: "Missing field: preferences" });
    }

    // Check required fields in preferences
    if (typeof preferences.color !== 'string' || preferences.color.trim() === '') {
        return res.status(400).json({ error: "Missing field: color" });
    }
    if (typeof preferences.hobby !== 'string' || preferences.hobby.trim() === '') {
        return res.status(400).json({ error: "Missing field: hobby" });
    }

    const response = {
        message: `Hello, ${name}!`,
        ageMessage: `You're ${age} years old.`,
        preferencesMessage: `Your favorite color is ${preferences.color} and you enjoy ${preferences.hobby}.`,
        offerMessage: age >= 18 ? "You're eligible for our special offers!" : undefined,
    };

    return res.status(200).json(response);
}
