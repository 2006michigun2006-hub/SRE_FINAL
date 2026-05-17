const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const updateProfileSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email()
});
router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch(err) {
        next(err);
    }
});
router.put('/profile', authMiddleware, async (req, res, next) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, email } = req.body;
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({ message: 'User is not found;(' });
        }
        if(username) {
            user.username = username;
        }
        if(email) {
            user.email = email;
        }
        await user.save();
        res.json({ message: 'Profile updated successfully', user: { username: user.username, email: user.email } });
    } catch(err) {
        next(err);
    }
});

module.exports = router;