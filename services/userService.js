const User = require('../models/User');


exports.getOne = (userId) => User.findById(userId);
exports.getOneWithPosts = (userId) => User.findById(userId).populate('myPosts');

exports.addPost = (userId, postId) => {

    return User.updateOne({_id: userId}, {$push: {myPosts: postId}});
}

