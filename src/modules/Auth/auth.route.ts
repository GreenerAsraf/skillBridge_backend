import express from 'express'
import { AuthController } from './auth.controller'
import { UserController } from '../User/user.controller'
import { authMiddleware } from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'

const router = express.Router()

router.post('/register', validateRequest(AuthValidation.createUserValidationSchema), AuthController.createUser)


router.post('/login', validateRequest(AuthValidation.loginUserValidationSchema), AuthController.loginUser)
router.get('/me', authMiddleware('STUDENT', 'TUTOR', 'ADMIN'), UserController.getMe)

export const AuthRoutes = router
