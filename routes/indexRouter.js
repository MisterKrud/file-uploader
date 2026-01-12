const { Router } = require("express")
const router = Router();
const cloudinary = require("../config/cloudinary")
const userController = require("../controllers/userControllers")
const passport = require("../config/passport")
const multer = require("multer");
const { DbNull } = require("@prisma/client/runtime/client");


const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, "./public/uploads")
    // },
    filename: (res, file, cb) =>{
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});
router.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

router.get("/", userController.getAllFoldersAndFiles)

// router.get("/",async (req, res) => {
//      console.log("SESSION:", req.session);
//   console.log("REQ.USER:", req.user);
 
 
// //   res.send(req.body)
//     res.render("index");
// });

router.get("/login", (req, res) => res.render("login"))
router.get("/signup", (req, res) => res.render("signup"))
router.get("/edit-files", userController.getAllFoldersAndFilesEdit)

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

router.get("/:folderId", userController.getAllFoldersAndFiles)
router.get("/:folderId/edit-files", userController.getAllFoldersAndFilesEdit)

router.post("/createUser", userController.createUser)

router.get("/upload-form", (req, res) => res.render("upload-form"))

router.post("/upload", upload.single("avatar"), userController.cloudinaryUpload, userController.uploadFileIntoFolder)

router.post("/:id/upload", upload.single("avatar"), userController.cloudinaryUpload, userController.uploadFileIntoFolder)

router.post("/create-folder", userController.createFolder)

router.post("/:id/delete-file", userController.cloudinaryDelete, userController.deleteFile)

router.post("/:id/update-filename", userController.updateFileName)
router.post("/:folderId/delete-folder", userController.deleteFolder)
router.post("/:folderId/delete-folder-files", userController.cloudinaryDeleteAllFolderFiles, userController.deleteFolderAndFiles)

router.post("/:folderId/update-foldername", userController.updateFolderName)



module.exports = router