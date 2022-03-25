const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// Get all users
router.get("/", async (req, res) => {
  const dbUsersData = await User.findAll({
    attributes: { exclude: ["password"] },
    
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
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout a user
router.post("/logout", (req, res) => {});

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
