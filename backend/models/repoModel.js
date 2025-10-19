const mongoose = require('mongoose');
const { Schema } = mongoose;

const repoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: [{
        type: String,
    }],
    visibility: {
        type: Boolean,
    },
    language: {
        type: String,
        default: 'JavaScript', 
    },
    languageColor: {
        type: String, 
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    }]
});

// Mongoose pre-save hook to automatically set the languageColor
repoSchema.pre('save', function(next) {
    const languageColorMap = {
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#3178c6',
        'Shell': '#89e051',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516'
    };

    if (this.language && languageColorMap[this.language]) {
        this.languageColor = languageColorMap[this.language];
    } else {
      
        this.languageColor = '#8b949e'; 
    }

    next();
});

const Repository = mongoose.model('Repository', repoSchema);
module.exports = Repository;
