const express = require('express');
const User = require('../models/User');
const router = express.Router();
const questions = [
    { id: 1, q: "2 + 2 = ?", a: ["3", "4", "22"], c: "4" },
    { id: 2, q: "What color is the sky?", a: ["Blue", "Green", "Red"], c: "Blue" },
    { id: 3, q: "How many wheels does the car have?", a: ["2", "4", "5"], c: "4" },
    { id: 4, q: "What thing doesn't change its color?", a: ["Tree", "Traffic Lights", "Bunny"], c: "Tree" },
    { id: 5, q: "What is heavyer: 1 kg of flower or 1 kg steel?", a: ["Flower", "Steel", "All"], c: "All" },
    { id: 6, q: "Carry on the equation: 2, 4, 6, 8...", a: ["9", "10", "12"], c: "10" },
    { id: 7, q: "How many fingers in your hand?", a: ["4", "5", "6"], c: "5" },
    { id: 8, q: "Who speaks gav-gav'?", a: ["Cat", "Dog", "Crocodile"], c: "Dog" },
    { id: 9, q: "10 - 3 = ?", a: ["7", "6", "8"], c: "7" },
    { id: 10, q: "Capital of Great Britain?", a: ["Paris", "London", "Berlin"], c: "London" },
    { id: 11, q: "How many days a week?", a: ["6", "7", "8"], c: "7" },
    { id: 12, q: "What number comes after 19?", a: ["18", "20", "21"], c: "20" },
    { id: 13, q: "What is a fruit?", a: ["Coconut", "Apple", "Potato"], c: "Apple" },
    { id: 14, q: "5 * 5 = ?", a: ["20", "25", "30"], c: "25" },
    { id: 15, q: "What sputnik the does Earth have?", a: ["Mars", "Moon", "Sun"], c: "Moon" },
    { id: 16, q: "What comes after 'A' in alphabet?", a: ["B", "D", "J"], c: "O" },
    { id: 17, q: "What is current year?", a: ["2024", "2025", "2026"], c: "2026" },
    { id: 18, q: "How many legs does Spider have?", a: ["6", "8", "10"], c: "8" },
    { id: 19, q: "What planet is after the sun?", a: ["Venera", "Earth", "Mars"], c: "Earth" },
    { id: 20, q: "Are you bot?", a: ["Yes", "No", "MEOW"], c: "No" }
];
router.get('/questions', (req, res) => {
    res.json(questions.map(({ c, ...q }) => q));
});
router.post('/reset', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ msg: 'Login required' });
    await User.findByIdAndUpdate(req.session.userId, { score: 0, answersCount: 0 });
    res.json({ success: true });
});
router.post('/submit', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ msg: 'Login required' });
    const { qId, ans } = req.body;
    const q = questions.find(item => item.id === qId); 
    let isCorrect = (q && q.c === ans);
    const points = isCorrect ? 5 : 0;
    await User.findByIdAndUpdate(req.session.userId, { 
        $inc: { score: points, answersCount: 1 } 
    });
    res.json({ success: true });
});
router.get('/leaderboard', async (req, res) => {
    const list = await User.find().sort({ score: -1 }).limit(10).select('name score');
    res.json(list);
});
module.exports = router;