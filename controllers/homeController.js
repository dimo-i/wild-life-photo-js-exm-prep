
const router = require('express').Router();

const userService = require('../services/userService');


router.get('/', async (req, res) => {
    
    res.render('home');

})

//TODO show all post of user
router.get('/my-posts', async (req, res) => {
    const user = await userService.getOneWithPosts(req.user._id).lean();

    // const userPost = user.myPosts.find(x=>x)

    // console.log(userPost.author.email)
    res.render('home/my-posts', {...user})
})


module.exports = router;


