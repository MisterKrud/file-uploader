const { Router } = require("express")
const router = Router();
const userController = require("../controllers/userControllers")
const passport = require("../config/passport")
const multer = require("multer");
const { DbNull } = require("@prisma/client/runtime/client");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (res, file, cb) =>{
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});

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

router.get("/upload-form", (req, res) => res.render("upload-form"))

router.post("/profile", upload.single("avatar"), userController.uploadFile)


module.exports = router