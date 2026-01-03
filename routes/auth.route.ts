import express  from 'express';
import { authController } from '../controllers/auth.controllers';

const authRouter = express.Router();


authRouter.post('/login',express.json(),authController.signIn)
.post('/register',express.json(),authController.signUp)
.post('/forget-password',express.json(),authController.sendPasswordResetLink)
.post('/reset/:str',express.json(),authController.resetPassword)

export default authRouter;