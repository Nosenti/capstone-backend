import express from 'express';
import authController from '../controllers/auth.js';
import userController from '../controllers/user.js';
import postController from '../controllers/post.js';
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()
router.use(express.json());

router.get('/',(req,res)=>{
  res.status(200).send('Welcome to ALUxFeed')
})
router.post('/users/signup',authController.signup)
router.post('/users/signin',authController.signin)

router.post('/users/forgotPassword',authController.forgotPassword)
router.patch('/users/resetPassword/:token',authController.resetPassword)
router.get('/users/confirmEmail/:token',authController.confirmEmail)
router.patch('/users/updatePassword', checkAuth.verifyUser, authController.updatePassword)
router.patch('/users/updateMe', checkAuth.verifyUser, userController.updateMe)
router.get('/users/getUsers', userController.getUsers)

router.post('/posts', checkAuth.verifyUser, postController.createPost)

export default router;