const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Get all users
router.get("/", async (req, res) => {
  const dbUsersData = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "created_at", "updated_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment", "created_at", "updated_at"],
      },
    ],
    
  });
  const users = dbUsersData.map((user) => user.get({ plain: true }));
  res.json(users);
});

// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Post,
          attributes: ["id", "title", "content", "created_at"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: Post,
            attributes: ["title"],
          },
        },
      ],
    });

    const user = dbUserData.get({ plain: true });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    
    if (user) {
      const validPassword = await user.validatePassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect password!" });
        return;
      }

      req.session.save(() => {
        // declare session variables
        req.session.user_id = user.id;
        req.session.username = user.username;
        req.session.loggedIn = true;
  
        res.json({ user: user, message: "You are now logged in!" });
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout a user
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id,
      },
    });
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(deletedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
