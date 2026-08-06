import { type Request, type Response } from 'express'
import { success, z } from 'zod'
import pool from '../db/db.js'

const PlayerStatSchema = z.object({
    name: z.string().min(1, "Player name is required"),
    goals: z.number().min(0, "Goals cannot be negative"),
    assists: z.number().min(0, "Assists cannot be negative"),
})
const UpdatePlayerSchema = z.object({
    goals: z.number().min(0, "Goals cannot be negative"),
    assists: z.number().min(0, "Assists cannot be negative"),
})

const createPlayer = async (req: Request, res: Response) => {
    const validation = PlayerStatSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: "Invalid data", details: validation.error.issues })
    }
    try {
        const { name, goals, assists } = validation.data;
        const query = `
    INSERT into players (name,goals,assists)
    VALUES ($1,$2,$3)
    RETURNING *`;
        const values = [name, goals, assists]
        const result = await pool.query(query, values)
        const savedPlayer = result.rows[0]

        console.log(`Saved stats to Neon database for ${name}: ${goals} Goals, ${assists} Assists.`);
        return res.status(200).json({
            success: true,
            message: "New Player saved successfully.",
            data: savedPlayer
        })
    } catch (error) {
        console.error('Database insert error', error)
        return res.status(500).json({
            success: false,
            message: "Failed to create player"
        })
    }
}
const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const query = `
        SELECT * FROM players 
        ORDER BY created_at DESC`;
        const result = await pool.query(query);
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched player details',
            data: result.rows
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error("Database fetch error: ", error.message);
        }
        return res.status(500).json({
            success: false,
            error: "Failed to fetch players from the database."
        });
    }
}
const updatePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const validation = UpdatePlayerSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid data",
                details: validation.error.issues
            })
        }
        const { goals, assists } = validation.data
        const query = `
        UPDATE players
        SET goals =$1, assists =$2
        WHERE player_id = $3
        RETURNING *`
        const values = [goals, assists, playerId]
        const result = await pool.query(query, values)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Player not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: `Successfully updated ${playerId}`,
            data: result.rows[0]
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error("Database update error: ", error.message);
        }
        return res.status(500).json({
            success: false,
            error: "Failed to update the player."
        });
    }
}
const deletePlayer = async (req: Request, res: Response) => {
    try {
        const playerId = req.params.id;
        const query = `
        DELETE FROM players 
        WHERE player_id =$1
        RETURNING *`
        const values = [playerId]
        const result = await pool.query(query, values)
        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Player not found"
            })
        };
        return res.status(200).json({
            success: true,
            message: "Player removed successfully.",
            data: result.rows[0]
        })

    } catch (error) {
        if (error instanceof Error) {
            console.error("Database update error: ", error.message);
        }
        return res.status(500).json({
            success: false,
            error: "Failed to update the player."
        });
    }

}

export { createPlayer, getAllPlayers, updatePlayer, deletePlayer };