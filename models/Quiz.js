const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' },
    creatorName: { 
        type: String 
    },
    questions: [{
        questionText: { 
            type: String, 
            required: true 
        },
        options: [{ 
            type: String, 
            required: true 
        }], 
        correctAnswer: { 
            type: Number, 
            required: true 
        } 
    }]
});
module.exports = mongoose.model('Quiz', quizSchema);