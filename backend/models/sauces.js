const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;


const sauceSchema = mongoose.Schema({
    name: {type : String, required: false},
    manufacturer: {type : String, required: false},
    description: {type : String, required: false},
    mainPepper: {type : String, required: false},
    imageUrl: {type : String, required: false},
    heat: {type: Number, required: false},
    userId: {type : String, required: false},
    likes: {type: Number, required: false},
    dislikes: {type: Number, required: false},
    usersLiked: [String],
    usersDisliked: [String]
});


sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('sauce', sauceSchema)