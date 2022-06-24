const Post = require('../models/Post');

exports.getAll = () => Post.find(); 

exports.getOne = (postId) => Post.findById(postId)
exports.getOneWithAuthorsAndVotes = (postId) => Post.findById(postId).populate('author').populate('votesOnPost')

exports.create = (postData) => Post.create(postData); 

exports.updateOne = (postId, postData) => Post.updateOne({_id: postId}, {$set: postData}, {runValidators: true})

exports.delete = (postId) => Post.deleteOne({_id: postId})

