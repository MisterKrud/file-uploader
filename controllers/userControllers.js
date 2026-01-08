const bcrypt = require("bcryptjs");
require("dotenv").config()
const db = require("../db/queries");
const {body, validationResult, matchedData } = require("express-validator");
const { localsName } = require("ejs");

const userDesktopFolder = async(req, res, next)=> {
   if(!req.user) return next()

      try {
         const deskTopFolder = await db.getUserDesktopFolder(req.user.id)
         req.user.deskTopFolderId = deskTopFolder.id
         next()
      } catch (err) {
         next(err)
      }
} 


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


 const uploadFile = async (req, res, next) =>{
  console.log('req body', req.body)
  console.log('req params', req.params)
   await db.uploadFile(Number(req.params.id), req.file.originalname, req.file.filename, req.file.size)
   console.log(req.user.id)
   console.log(req.file)
  
   return res.redirect("/")
   // next();
 }

 const getAllFoldersAndFiles = async (req, res, next)=> {
   if(req.user){
   const parentFolder = await db.getUserDesktopFolder(req.user.id);
   const files = await db.getAllFilesInFolder(parentFolder.id )
   const folders = await db.getAllUserFolders(parentFolder.id)
   console.log(files)
   console.log(folders)
   console.log(req.files)
   console.log(req.folders)

   return res.render("index", {
      files: files,
      folders: folders
   })
} else {
   console.log('No user logged in')
   res.render("index")
}
 }

 const getFilesInParentFolder = async (req, res) => {
   console.log(req.params)
   const parentFolder = await db.getParentFolder(Number(req.params.folderId))
  console.log('req.folders',req.folders)
   const files = await db.getAllFilesInFolder(parentFolder.id)
   return res.render("index", {
      files: files,
      folders: parentFolder,
      
   })
 }

   const createFolder = async (req, res) =>{
      const parentFolder = await db.getUserDesktopFolder(req.user.id)
      const newFolder = await db.createUserFolder(req.user.id, req.body.folderName, parentFolder.id)
      return res.send(newFolder)
   }
   
 
 

 const getUser = async(req, res,) => {
    const userId = req.params.id
    const user = await db.getUser(userId)
    return res.send(user)
 }

 module.exports = { 
   createUser,
   uploadFile ,
   createFolder, 
   getAllFoldersAndFiles,
   getFilesInParentFolder,
   userDesktopFolder
}
 

