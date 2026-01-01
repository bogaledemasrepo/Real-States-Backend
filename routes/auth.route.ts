import express  from 'express';
import { getPasswordResetLink, login, register } from '../controllers/auth.controllers';

const authRouter = express.Router();


authRouter.post('/login',express.json(),login)
.post('/register',express.json(),register)
.post('/forget-password',express.json(),getPasswordResetLink)

export default authRouter;