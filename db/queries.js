const prisma = require("../lib/prisma")


async function createUser(username, name, password){
     const user =  await prisma.user.create({
    data: {
        username: username,
        name: name,
        password: password,
        folders: {
            create: {
                name: `${name}'s desktop`,
            }
        }
    },
    include: {
        folders: true
    },
  })
  return user
    }

async function uploadFile(folderid, filename, storagekey, size) {
    const file = await prisma.file.create({
      data: {
        name: filename,
        folderId: folderid,
        storageKey: storagekey,
        size: size
      }
    })
    // return file
  }

  async function getUserDesktopFolder(userid) {
    const desktopFolder = await prisma.folder.findFirst({
      where: {
        userId: userid
      },
      orderBy: {
        id: "asc"
      }
    })
    return desktopFolder
  }

  async function getParentFolder(folderid){
    const parentFolder = await prisma.folder.findUnique({
      where: {
        id: folderid
      }
    })
    return parentFolder
  }

  async function createUserFolder(userid, name, parentfolderid) {
    const folder = await prisma.folder.create({
      data: {
        userId: userid,
        name: name,
        parentFolderId: parentfolderid,
      }
    })
    return folder
  }

  async function getUserFolderByName(userid, foldername) {
    const userFolder = await prisma.folder.findUnique({
      where: {
        userId: userid,
        name: foldername,
      }
    })
    return userFolder.id
  }

  async function getAllFilesInFolder(parentFolderId){
  
    const files = await prisma.file.findMany({
      where: {
        
        folderId: parentFolderId
      }
    })
    return files
  }

  async function getAllUserFolders(parentFolderId){
    const folders = await prisma.folder.findMany({
      where: {
        parentFolderId: parentFolderId,
      }
    }) 
    return folders
  }

  // async function getAllUserFolders(userId){
  //   const folders = await prisma.folder.findMany({
  //     where: {
  //       userId: userId
  //     }
  //   })
  //   return folders
  // }

 async function getUser(userid){
      const user = await prisma.user.findUnique({
        where: {
          id: userid
        }
      })
      return user
    }

  async function getUserByUsername(username){
      const user = await prisma.user.findUnique({
        where: {
          username: username
        }
      })
      console.log('Get user by username', user)
      return user
    }

    async function getFolder(folderid) {
      const folder = await prisma.folder.findUnique({
        where: {
          id: folderid
        }
      })
      return folder
    }


//update
async function updateFileName(fileid, newName){
  const file = await prisma.file.update({
    where: {
      id: fileid
    },
    data: {
      name: newName
    }
  })
}

async function updateFolderName(folderid, newName){
  const folder = await prisma.folder.update({
    where: {
      id: folderid
    },
    data: {
      name: newName
    }
  })
}

  // async function updateUser(userId, name, username){
  //     await prisma.user.update({
  //       where: {
  //         id: userId,
  //       },
  //       data: {
  //         name: name,
  //         username: username,
  //       }
  //     })
  //   }

  // async function updateUserPassword(userId, password){
  //     await prisma.user.update({
  //       where: {
  //         id: userId,
  //       },
  //       data: {
  //         password: password
  //       }
  //     })
  //   }

  //  async function makeAdmin(userId) {
  //     await prisma.user.update({
  //   where: {
  //     id: userId,
  //       },
  //       data: {
  //         role_id: 2
  //       }
  // })
  //   }

  //  async function deleteUser(userId) {
  //     await prisma.user.delete({
  //       where: {
  //         id: userId
  //       }
  //     })
  //   }

  async function getFile(fileid){
    const file = await prisma.file.findUnique({
      where: {
        id: fileid
      }
    })
    return file
  }

async function deleteFile(fileid){
  const deleteFile = await prisma.file.delete({
    where: {
      id: fileid
    }
  })
}

async function deleteFolder(folderid){
  const deleteFolder = await prisma.folder.delete({
    where: {
      id: folderid
    }
  })
}

async function moveFilesToParent(folderId, parentFolderId){
  
  const updateFiles = await prisma.file.updateMany({
    where: {
      folderId: folderId
    },
    data: {
      folderId: parentFolderId
    }
  })
}
 
module.exports = {
  createUser,
  getUser,
  getUserByUsername,
  uploadFile,
  getUserDesktopFolder,
  getParentFolder,
  getUserFolderByName,
  createUserFolder,
  getAllFilesInFolder,
  getAllUserFolders,
  deleteFile,
  getFile,
  updateFileName,
  updateFolderName,
  deleteFolder,
  getFolder,
  moveFilesToParent
}









 

  