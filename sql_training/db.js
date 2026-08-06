import dotenv from 'dotenv'
dotenv.config()
import pg from 'pg';
console.log("My DB URL is:", process.env.DATABASE_URL);
const {Pool} = pg;

const pool = new Pool ({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized: false
    }
})

pool.connect((err)=>{
    if(err){
        console.error("Connection error: ",err.stack)
    }else{
        console.log("Connected to Neon database")
    }
})
export default pool;