const multer = require("multer");

const storage = multer.diskStorage({
    filename: (res, file, cb) =>{
        cb(null, file.originalname)
    }
})

module.exports = {
    multer,
    storage
}