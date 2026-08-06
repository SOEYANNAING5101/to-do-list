import { Router } from 'express';
import  {createPlayer,getAllPlayers,updatePlayer,deletePlayer} from '../controllers/player.controller.js'
const router = Router();
router.post('/',createPlayer)
router.get('/',getAllPlayers)
router.put('/:id',updatePlayer)
router.delete('/:id',deletePlayer)


export default router;