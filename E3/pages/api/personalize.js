export default function handler(req, res) {
    const { data } = req.query;

    // Check if data is provided and is an object
    if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: "Missing or invalid field: data" });
    }

    // Check required fields are provided
    if (!data.hasOwnProperty('name')) {
        return res.status(400).json({ error: "Missing field: name" });
    }
    if (!data.hasOwnProperty('age')) {
        return res.status(400).json({ error: "Missing field: age" });
    }
    if (!data.hasOwnProperty('preferences')) {
        return res.status(400).json({ error: "Missing field: preferences" });
    }

    const preferences = data.preferences;

    // Check if preferences is an object
    if (typeof preferences !== 'object' || preferences === null) {
        return res.status(400).json({ error: "Invalid field: preferences" });
    }

    // Check required fields in preferences
    if (!preferences.hasOwnProperty('colour')) {
        return res.status(400).json({ error: "Missing field: colour" });
    }
    if (!preferences.hasOwnProperty('hobby')) {
        return res.status(400).json({ error: "Missing field: hobby" });
    }

    const name = data.name;
    const age = data.age;
    const colour = preferences.colour;
    const hobby = preferences.hobby;

    // Validate the types
    if (typeof name !== 'string') {
        return res.status(400).json({ error: "Invalid field type: name should be a string" });
    }
    if (typeof age !== 'number') {
        return res.status(400).json({ error: "Invalid field type: age should be a number" });
    }
    if (typeof colour !== 'string') {
        return res.status(400).json({ error: "Invalid field type: colour should be a string" });
    }
    if (typeof hobby !== 'string') {
        return res.status(400).json({ error: "Invalid field type: hobby should be a string" });
    }

    if (age >= 18) {
        return res.json({ message: `Hello ${name}, you are ${age} years old! Your favourite colour is ${colour} and you enjoy ${hobby}. You're eligible for our special offers!` });
    }
    return res.json({ message: `Hello ${name}, you are ${age} years old! Your favourite colour is ${colour} and you enjoy ${hobby}.` });
}