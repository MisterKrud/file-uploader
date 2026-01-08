const { Router } = require("express");
const { uploadFile } = require("../db/queries");
const router = Router();
const userController = require("../controllers/userControllers");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads")
    },
    filename: (res, file, cb) =>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage});


router.get("/", (req, res) => res.send("Inside the folders"))
router.get("/:id", (req, res) => res.render("index"))
// router.post("/:id/upload", upload.single("avatar"), userController.uploadFile)


module.exports = router