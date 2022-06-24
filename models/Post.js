const mongoose = require('mongoose');

const URL_PATERN = /^https?:\/\/(.+)/;

const postSchema = new mongoose.Schema({

    title: {
        type: String, 
        required: [true, 'Title is required'],
        minlength: [6, 'Title should be at least 6 characters long!'],
    },

    keyword: {
        type: String,
        required: [true, 'keyword is required'],
        minlength: [6, 'keyword should be at least 6 characters long!'],
    },
    location: {
        type: String,
        required: [true, 'please enter location'],
        maxlength: [15, 'location should not be longer than 15 characters long!'],
    },
    dateOfCreation: {
        type: String,
        required: [true, 'Please enter date of creation'],
        minlength: [10, 'Date should be in the correct format / 10 chars long'],
        maxlength: [10, 'Date should be in the correct format / 10 chars long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator: function (value) {
                return URL_PATERN.test(value);
            },
            message: "Image must be a valid URL"
        },
    },
    description: {
        type: String,
        required: [true, 'Please fill the description field.'],
        minlength: [8, 'description should be at least 8 characters long!'],
    },
    ratingOfPost: {
        type: Number, 
        default: 0
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    votesOnPost: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;