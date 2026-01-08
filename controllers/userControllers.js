const bcrypt = require("bcryptjs");
require("dotenv").config()
const db = require("../db/queries");
const {body, validationResult, matchedData } = require("express-validator");

const userValidator =[
    body("name").trim(),
    body("username").trim(),
    body("password").trim()
    .isAlphanumeric().withMessage('Password must be alphanumeric'),
    body("confirmPassword").trim()
    .custom((value, {req}) => {
        return value === req.body.password;
    }).withMessage("Passwords do not match")
 ]

 const createUser = [
    userValidator, async(req, res, next) => {
         const errors = validationResult(req)
    if(!errors.isEmpty()){
       return res.status(400).render("index", {
        errors: errors.array(),
       }
       )
    } 
       const user = matchedData(req)
       const hashedPassword = await bcrypt.hash(user.password, 10);
       await db.createUser(user.username, user.name, hashedPassword)
       const newUser = await db.getUserByUsername(user.username)
       console.log('username', user.username)
       console.log('newUser',newUser)
       req.login(newUser, (err) => {
        if(err) return next(err);
        return res.redirect("/")
       })
    }
 ]


 const uploadFile = async (req, res) =>{
   const folderid = await db.getUserDesktopFolder(req.user.id)
   await db.uploadFile(folderid, req.file.originalname, req.file.filename, req.file.size)
   console.log(req.user.id)
   console.log(req.file)
   return res.send("file uploaded")
 }

   const createFolder = async (req, res) =>{
      const parentFolderId = await db.getUserDesktopFolder(req.user.id)
      const newFolder = await db.createUserFolder(req.user.id, req.body.folderName, parentFolderId)
      return res.send(newFolder)
   }
   
 
 

 const getUser = async(req, res) => {
    const userId = req.params.id
    const user = await db.getUser(userId)
    return res.send(user)
 }

 module.exports = { 
   createUser,
   uploadFile ,
   createFolder
}
 

