const { Post, User, Comment } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
    try {
        const dbPostsData = await Post.findAll({
            attributes: [
                "id",
                "title",
                "content",
                "created_at",
            ],
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                },
                {
                    model: Comment,
                    attributes: ["id", "comment"],
                },
            ],
        });
        const posts = dbPostsData.map((post) => post.get({ plain: true }));
        res.render('homepage', {
            posts
        });
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;