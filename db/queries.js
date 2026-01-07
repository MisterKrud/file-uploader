const prisma = require("../lib/prisma")



  async function createUser(username, name, password){
     const user =  await prisma.user.create({
    data: {
        username: username,
        name: name,
        password: password,
        folders: {
            create: {
                name: "default",
            }
        }
    },
    include: {
        folders: true
    },
  })
  return user
    }


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
      return user
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

module.exports ={
  createUser,
  getUser,
  getUserByUsername
}









 

  