const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');

const { preloadPost, isPostAuthor } = require('../middlewares/postMiddleware')
const userService = require('../services/userService');
const postService = require('../services/postService');




router.get('/', async (req, res) => {
    const allPosts = await postService.getAll().lean();

    res.render('post/all-posts', { allPosts })
});


router.get('/:postId/details', async (req, res) => {
    const post = await postService.getOneWithAuthorsAndVotes(req.params.postId).lean();
    // const user = await userService.getOne(req.user._id);


    
    const isAuthor = post.author._id == req.user?._id;

    const totalScore = post.votesOnPost.length
    console.log(totalScore)
    const isVoted = post.votesOnPost.some(x => x._id == req.user._id)
    console.log(isVoted)
    const voters = post.votesOnPost.map(x => x.email).join(', ');
    console.log(voters)

    res.render('post/details', { ...post, isAuthor, isVoted, voters, totalScore });


});


router.get('/create', (req, res) => {

    res.render('post/create');
});

router.post('/create', isAuth, async (req, res) => {

    const postData = { ...req.body, author: req.user._id }

    try {
        const post = await postService.create(postData);
        await userService.addPost(req.user._id, post._id)
        res.redirect('/posts');

    } catch (error) {
        res.render('post/create', { ...req.body, error: getErrorMessage(error) })
    }


});


router.get('/:postId/edit', isAuth, preloadPost, isPostAuthor, (req, res) => {

    res.render('post/edit', { ...req.post })
});

router.post('/:postId/edit', isAuth, preloadPost, isPostAuthor, async (req, res) => {

    try {
        await postService.updateOne(req.params.postId, req.body);
        res.redirect(`/posts/${req.params.postId}/details`)
    } catch {
        res.render('post/edit', { ...req.body, error: getErrorMessage(error) })

    }
});


router.get('/:postId/delete', isAuth, preloadPost, isPostAuthor, async (req, res) => {
    await postService.delete(req.params.postId);
    res.redirect('/posts')
});



router.get('/:postId/upVote', isAuth, async (req, res) => {
    const post = await postService.getOne(req.params.postId);
    const user = await userService.getOne(req.user._id);

    post.votesOnPost.push(user);
    
    post.save();

    res.redirect(`/posts/${req.params.postId}/details`)

})

router.get('/:postId/downVote', isAuth, async (req, res) => {
    const post = await postService.getOne(req.params.postId);
    const user = await userService.getOne(req.user._id);

    post.votesOnPost.pop(user);
    
    post.save();

    res.redirect(`/posts/${req.params.postId}/details`)

})



module.exports = router;