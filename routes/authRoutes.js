const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); 
const User = require('../models/User');
const router = express.Router();
const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
router.post('/register', async (req, res, next) => {
    try {
        await registerSchema.validateAsync(req.body);
        const { username, email, password } = req.body; 
        const existingUser = await User.findOne({$or: [{ username }, { email }]});
        if(existingUser) {
            return res.status(400).json({message: 'User or Email already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            count: 0 
        });
        await newUser.save();
        res.status(201).json({message:'User registered successfully!'});
    } catch(err) {
        next(err); 
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(409).json({message: 'Invalid input!'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(409).json({message: 'Invalid input!'});
        }
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.json({ 
            token, 
            username: user.username, 
            count: user.count 
        });
    } catch(err) {
        next(err);
    }
});
module.exports = router;