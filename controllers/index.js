const router = require("express").Router();


router.use('/', router.get('/', (req, res) => {
    res.send("Hello World!");
}));

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;