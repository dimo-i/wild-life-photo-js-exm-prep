const postService = require('../services/postService')

exports.preloadPost = async (req, res, next) => {
    const post = await postService.getOne(req.params.postId).lean();

    req.post = post
    next();
}

exports.isPostAuthor = (req, res, next) => {
    if (req.post.author != req.user._id){
        return next({message: 'You are not authorized!', status: 401});
    }
    next();
}