var mongoose = require('mongoose');

//var ingredients = {
//    "tomato": "3 pounds",
//    "butter": "1 packet",
//    "salt": "1 spoon",
//    "tomato": "12 pounds"
//}
var listSchema = new mongoose.Schema({

    ingredient: {
        type: String,
        required: false
    },

    qty: {
        type: String,
        required: false
    }



});

var list = mongoose.model('list', listSchema);

module.exports = list;
