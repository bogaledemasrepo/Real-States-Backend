import express  from 'express';
import { userController } from '../controllers/users.controllers';

const userRouter = express.Router();


userRouter.get('/',express.json(),userController.getAllUser)
.get('/paged',express.json(),userController.getUsersPaged)
.get('/:userId',express.json(),userController.getUserDetail)
.put('/:userId',express.json(),userController.updateUserDetail)
.delete('/:userId',express.json(),userController.deleteUserDetail)

export default userRouter;