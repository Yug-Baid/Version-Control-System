const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/UserController')

userRouter.get('/getAllUsers',userController.getAllUsers)
userRouter.post('/signup',userController.signup)
userRouter.post('/login',userController.login)
userRouter.get('/getUser',userController.getUserProfile)
userRouter.put('/updateUser',userController.updateUserProfile)
userRouter.delete('/deleteUser',userController.deleteUserProfile)

module.exports = userRouter