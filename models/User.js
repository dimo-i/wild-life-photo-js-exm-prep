const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../config/env')

const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter First Name!'],
        minlength: [5, 'First name should be at least 5 characters long!'],
    },

    lastName: {
        type: String,
        required: [true, 'Please enter Last Name!'],
        minlength: [5, 'Last name should be at least 5 characters long!'],

    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function (value) {
                return EMAIL_PATTERN.test(value);
            },
            message: "Please enter valid e-mail"
        },
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [4, 'password should be at least 4 characters long!']
    },
    //// change the name of the collection in userService
    myPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }]
    
});

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword => {
        this.password = hashedPassword
        next()
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;