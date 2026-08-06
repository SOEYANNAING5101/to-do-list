import express,{type Request, type Response} from 'express'
import cors  from 'cors'
import { success, z } from 'zod'
import playerRoutes from './routes/player.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express();
app.use(cors())
app.use(express.json())

app.get('/api/health',(req,res)=>{
    res.json({status: 'success',message:'Backend is connected and ready'})
})

app.use('/api/players',playerRoutes)
app.use ('/api/tasks',taskRoutes)

export default app;
