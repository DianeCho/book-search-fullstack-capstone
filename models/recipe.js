var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({

    //            author: {
    //                type: String,
    //                required: false
    //            },
    //
    //            title: {
    //                type: String,
    //                required: false
    //            });

    name: {
        type: String,
        required: false
    },
    rating: {
        type: String,
        required: false
    },
    course: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    day: {
        type: String,
        required: false
    },
    ingredients: {
        type: String,
        required: false
    },
    shortList: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    }
});
var recipe = mongoose.model('recipe', recipeSchema);

module.exports = recipe;
