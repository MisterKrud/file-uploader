const { Router } = require("express")
const router = Router();
const userController = require("../controllers/userControllers")
const passport = require("../config/passport")

router.get("/", (req, res) => {
     console.log("SESSION:", req.session);
  console.log("REQ.USER:", req.user);
    res.render("index");
});

router.get("/login", (req, res) => res.render("login"))
router.get("/signup", (req, res) => res.render("signup"))

router.get("/failure", (req, res) => res.render("failure"))

// router.get("/", (req, res) => {
//   req.session.testData = "Hello World"; // Force the session to be "dirty"
//   res.send("Check your database now!");
// });

router.post("/login", passport.authenticate("local", {
    
    successRedirect: "/",
    failureRedirect: "/failure"
    
}))

router.get("/logout", (req, res, next) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
    
})

router.post("/createUser", userController.createUser)

module.exports = router