import { Router } from 'express'
const router = Router()
import {createTask,getAllTask,updateTask,deleteTask,getTaskById} from '../controllers/task.controller.js'

router.post('/',createTask);
router.get('/',getAllTask);
router.put('/:id',updateTask);
router.delete('/:id',deleteTask);
router.get('/:id',getTaskById);
export default router;