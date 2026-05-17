const express = require('express');
const Joi = require('joi');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const quizSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    questions: Joi.array().items(Joi.object({
        questionText: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).required(),
        correctAnswer: Joi.number().integer().min(0).required()
    })).min(1).required()
});
router.get('/', async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};
        if(search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const quizzes = await Quiz.find(query);
        res.json(quizzes);
    } catch(err) {
        next(err);
    }
});
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz) {
            return res.status(404).json({ message: 'Quiz is not found;(' });
        }
        res.json(quiz);
    } catch(err) {
        next(err);
    }
});
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { error } = quizSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { title, questions } = req.body;
        const newQuiz = new Quiz({
            title,
            creator: req.user.id,
            creatorName: req.user.username,
            questions
        });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        next(err);
    }
});
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { error } = quizSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz) {
            return res.status(404).json({ message: 'Quiz is not found;(' });
        }
        if(quiz.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You dont have rights to change this quiz!' });
        }
        quiz.title = req.body.title || quiz.title;
        quiz.questions = req.body.questions || quiz.questions;
        await quiz.save();
        res.json({ message: 'Quiz is successfully updated!', quiz });
    } catch(err) {
        next(err);
    }
});
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz) {
            return res.status(404).json({ message: 'Quiz is not found;(' });
        }
        if(quiz.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You dont have rights to delete this quiz! Go away!' });
        }
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quiz is deleted!' });
    } catch(err) {
        next(err);
    }
});
router.post('/score', authMiddleware, async (req, res, next) => {
    try {
        const { points } = req.body;
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({ message: 'User is not found;(' });
        }
        user.count += points;
        await user.save();
        res.json({ message: 'New score!', totalScore: user.count });
    } catch(err) {
        next(err);
    }
});
module.exports = router;