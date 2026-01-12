const bcrypt = require("bcryptjs");
require("dotenv").config()
const cloudinary = require("../config/cloudinary")
const db = require("../db/queries");
const {body, validationResult, matchedData } = require("express-validator");
const { localsName } = require("ejs");

const cloudinaryUpload = async(req, res, next) => {
   try{
   const result = await cloudinary.uploader.upload(req.file.path) 
   req.upload = result
   console.log('cloudinary result', req.file.path)
   console.log(result)
   next()
     }  catch(err) {
         console.log(err);
         return res.status(500).json({
            success: false,
            message: "Error uploading to Cloudinary"
         })
      }
       
   }

const cloudinaryDelete = async(req, res, next) => {
   const file = await db.getFile(Number(req.params.id))
   await cloudinary.api.delete_resources_by_asset_ids([file.storageKey])
   console.log(req.body)
   next()
}
  
  



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


 const uploadFileIntoFolder = async (req, res, next) =>{
   console.log(req.params)
  const folderId = req.params.id
  try{
   if(req.file) {
   // cloudinary.uploader.upload(req.file.path, function(err, result) {
   //    if(err) {
   //       console.log(err);
   //       return res.status(500).json({
   //          success: false,
   //          message: "Error uploading to Cloudinary"
   //       })
   //    }
   //    return res.status(200).json({
   //       success: true,
   //       message: "File uploaded",
   //       data: result
   //    })
   // })
   
   await db.uploadFile(Number(folderId), req.file.originalname, req.upload.asset_id, req.file.size, req.upload.url, req.file.mimetype)
   console.log(req.user.id)
   console.log(req.user.path)
   console.log(req.file)
   // console.log('uploaded file', uploadedFile)
  
   return res.redirect(`/${folderId}`)
   } else {
      res.send("No file chosen. Click 'back' and try again")
   }
  } catch(err) {
   next(err);
 }
}

  const uploadFileIntoDesktopFolder = async (req, res, next) =>{
   const desktopFolder = await db.getUserDesktopFolder(req.user.id)
   console.log('desktopFolder',desktopFolder)
   const uploadedFile = cloudinaryUpload()
   await db.uploadFile(Number(desktopFolder.id), req.file.originalname, req.file.filename, req.file.size)
   console.log(req.user.id)
   console.log(req.file)
  console.log(uploadedFile)
   return res.redirect("/")
   // next();
 }

 const getAllFoldersAndFiles = async (req, res, next)=> {
   if(req.user){
      let parentFolder
      if(req.params.folderId){
         console.log('getallfoldersandfiles req params',req.params)
      parentFolder = await db.getParentFolder(Number(req.params.folderId))
     
      } else {
  parentFolder = await db.getUserDesktopFolder(req.user.id);
    
      }
      console.log('parent folder', parentFolder)
   const files = await db.getAllFilesInFolder(parentFolder.id)
   const folders = await db.getAllUserFolders(parentFolder.id)


   return res.render("index", {
      files: files,
      folders: folders,
      parentFolder: parentFolder
   })
} else {
   console.log('No user logged in')
   res.render("index")
}
 }



const getAllFoldersAndFilesEdit = async (req, res, next)=> {
   console.log('RUNNING: getAllFoldersAndFilesedit + REQ.PARAMS',req.params)
  
   if(req.user){
      let parentFolder
     
      if(req.params.folderId){
         // console.log('getallfoldersandfiles req params',req.params)
      parentFolder = await db.getParentFolder(Number(req.params.folderId))
     console.log('Sub-folder')
      console.log(parentFolder.id)
      } else {
  parentFolder = await db.getUserDesktopFolder(req.user.id);
    console.log('Desktop', parentFolder.id)
      }
      // console.log('parent folder', parentFolder)
   const files = await db.getAllFilesInFolder(parentFolder.id)
   const folders = await db.getAllUserFolders(parentFolder.id)


   return res.render("edit-files", {
      files: files,
      folders: folders,
      parentFolder: parentFolder
   })
} else {
   console.log('No user logged in')
   res.render("/")
}
 }


 const getFilesInParentFolder = async (req, res) => {
   // console.log(req.params)
   const parentFolder = await db.getParentFolder(Number(req.params.folderId))
//   console.log('req.folders',req.folders)
   const files = await db.getAllFilesInFolder(parentFolder.id)
   return res.render("index", {
      files: files,
      folders: parentFolder,
      
   })
 }

  const getFilesInParentFolderEdit = async (req, res) => {
   // console.log('getFilesInParentFolder req.query:')
   // console.log(req.params)
   const parentFolder = await db.getParentFolder(Number(req.params.folderId))
//   console.log('req.folders',req.folders)
   const files = await db.getAllFilesInFolder(parentFolder.id)
   return res.render("edit-files", {
      files: files,
      folders: parentFolder,
      
   })
 }

   const createFolder = async (req, res) =>{
      const parentFolder = await db.getUserDesktopFolder(req.user.id)
      const newFolder = await db.createUserFolder(req.user.id, req.body.folderName, parentFolder.id)
      return res.redirect("/")
   }
   

 const getUser = async(req, res,) => {
    const userId = req.params.id
    const user = await db.getUser(userId)
    return res.send(user)
 }

 //update
 const updateFileName = async(req, res) => {
   const file = await db.getFile(Number(req.params.id))
   const folderId = file.folderId
   console.log('Updating file name')
      await db.updateFileName(file.id,req.body.filename)
      console.log(file)
   return res.redirect(`/${folderId}`)
 }


const updateFolderName = async(req, res) => {
   const folder = await db.getFolder(Number(req.params.id))
   const parentFolderId = folder.parentFolderId
   await db.updateFolderName(Number(req.params.id), req.body.folderName)
   return res.redirect(`/${parentFolderId}`)
}



 //delete
 const deleteFile = async(req, res) => {
   console.log('req params', req.params.id)
   // await db.deleteFile()



   const fileId = Number(req.params.id)
   const file = await db.getFile(fileId)
   const folderId = file.folderId
   console.log('Deleting file', file)
   await db.deleteFile(fileId)
   res.redirect(`/${folderId}`)
 }

 
   const deleteFolder = async(req, res, next) => {
      
      
      const folderId = Number(req.params.folderId)
      const folder = await db.getFolder(folderId)
      const parentFolderId = folder.parentFolderId
      await db.moveFilesToParent(folderId, parentFolderId)
      await db.deleteFolder(folderId)
      console.log('Deleting folder', folder)
      res.redirect(`/${parentFolderId}`)
    
   }
  

const deleteFolderAndFiles = async(req, res, next) =>{
         
      const folderId = Number(req.params.folderId)
      const folder = await db.getFolder(folderId)
      const parentFolderId = folder.parentFolderId
     
      await db.deleteFolderAndFiles(folderId)
      console.log('Deleting folder and files', folder)
      res.redirect(`/${parentFolderId}`)
    
   }

 module.exports = { 
   cloudinaryUpload,
   createUser,
   uploadFileIntoDesktopFolder,
   uploadFileIntoFolder,
   createFolder, 
   getAllFoldersAndFiles,
   getFilesInParentFolder,
   userDesktopFolder, 
   deleteFile,
   deleteFolder,
   updateFileName,
   getAllFoldersAndFilesEdit,
   getFilesInParentFolderEdit,
   updateFolderName,
   deleteFolderAndFiles,
   cloudinaryDelete
}
 

