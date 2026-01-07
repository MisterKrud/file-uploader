const { Router } = require("express")
const router = Router();
const userController = require("../controllers/userControllers")
const passport = require("../config/passport")

router.get("/", (req, res) => {
    res.render("index");
});

// router.get("/", (req, res) => {
//   req.session.testData = "Hello World"; // Force the session to be "dirty"
//   res.send("Check your database now!");
// });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
}))

router.post("/createUser", userController.createUser)

module.exports = router