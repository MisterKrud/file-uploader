import { prisma } from '../lib/prisma.js'


   export async function createUser(username, name, password){
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


    export async function getUser(userid){
      const user = await prisma.user.findUnique({
        where: {
          id: userid
        }
      })
      return user
    }

    export async function getUserByUsername(username){
      const user = await prisma.user.findUnique({
        where: {
          username: username
        }
      })
      return user
    }
  // export  async function updateUser(userId, name, username){
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

  // export  async function updateUserPassword(userId, password){
  //     await prisma.user.update({
  //       where: {
  //         id: userId,
  //       },
  //       data: {
  //         password: password
  //       }
  //     })
  //   }

  //  export async function makeAdmin(userId) {
  //     await prisma.user.update({
  //   where: {
  //     id: userId,
  //       },
  //       data: {
  //         role_id: 2
  //       }
  // })
  //   }

  //  export async function deleteUser(userId) {
  //     await prisma.user.delete({
  //       where: {
  //         id: userId
  //       }
  //     })
  //   }


  









 

  