const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/UserController')

userRouter.get('/getAllUsers',userController.getAllUsers)
userRouter.post('/signup',userController.signup)
userRouter.post('/login',userController.login)
userRouter.get('/getUser/:id',userController.getUserProfile)
userRouter.put('/updateUser/:id',userController.updateUserProfile)
userRouter.delete('/deleteUser/:id',userController.deleteUserProfile)

module.exports = userRouter