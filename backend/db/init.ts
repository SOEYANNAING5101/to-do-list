import pool from './db.js';

const createPlayerTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS players (
        player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        goals INT NOT NULL DEFAULT 0,
        assists INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    try {
        console.log("Creating player table ...");
        await pool.query(query)
        console.log("Players table created successfully!");

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error creating table: ", error.message)
        }
    } finally {
        await pool.end()
    }
}

// createPlayerTable();

const createTaskTable = async () =>{
    const query = `
    CREATE TABLE IF NOT EXISTS tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    try{
        await pool.query(query)
        console.log("Table created")

    }catch(error){
        if(error instanceof Error){
            console.error('Error creating table',error)
        }
    }finally{
        await pool.end();
    }
}
createTaskTable();