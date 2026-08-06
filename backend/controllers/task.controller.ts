import { success, z } from 'zod';
import pool from '../db/db.js'
import { type Request, type Response } from 'express'


const TaskSchema = z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    is_completed: z.boolean().optional().default(false)
})
const UpdateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    is_completed: z.boolean().optional().default(false)
})
// Create new task
export const createTask = async (req: Request, res: Response) => {
    const validation = TaskSchema.safeParse(req.body)
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            details: validation.error.issues
        })
    }
    try {
        const { title, description, is_completed } = validation.data;
        const query = `
        INSERT INTO tasks (title,description,is_completed)
        VALUES ($1,$2,$3)
        RETURNING *`
        const values = [title, description || 'New task', is_completed]
        const response = await pool.query(query, values)
        const data = response.rows[0]
        return res.status(201).json({
            success: true,
            message: "New task created",
            data: data
        })
    } catch (error) {
        console.error("Error crating new task", error)
        return res.status(500).json({
            success: false,
            error: "Error creating new task"
        })
    }
}
// Fetch all task
export const getAllTask = async (req: Request, res: Response) => {
    try {
        const query = `
        SELECT * FROM tasks
        ORDER BY created_at DESC`
        const response = await pool.query(query)
        return res.status(200).json({
            success: true,
            message: "Task list successfully fetched",
            data: response.rows
        })

    } catch (error) {
        console.error("Error fetching task list", error)
        return res.status(500).json({
            success: false,
            error: "Error fetching task list"
        })
    }
}
// Update task details
export const updateTask = async (req: Request, res: Response) => {
    const task_id = req.params.id;
    const validation = UpdateTaskSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            details: validation.error.issues
        })
    }
    const { title, description, is_completed } = validation.data;
    try {
        const query = `
    UPDATE tasks 
    SET title =$1, description =COALESCE($2,description),is_completed=COALESCE($3,is_completed)
    WHERE task_id =$4
    RETURNING *`;
        const values = [
            title ?? null,
            description ?? null,
            is_completed ?? null,
            task_id
        ];
        const response = await pool.query(query, values);
        if (response.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Task Updated successfully",
            data: response.rows[0]
        })

    } catch (error) {
        console.error("Error updating task", error)
        return res.status(500).json({
            success: false,
            error: "Error updating task"
        })
    }
}
// Delete task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task_id = req.params.id;
        const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING*`;
        const values = [task_id]
        const response = await pool.query(query, values);
        if (response.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })
        };
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
            data: response.rows
        })
    } catch (error) {
        console.error("Error deleting task", error)
        return res.status(500).json({
            success: false,
            error: "Error deleting task"
        })
    }

}

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task_id = req.params.id;
        const query = `SELECT * from tasks WHERE task_id = $1`;
        const values = [task_id];
        const response = await pool.query(query, values);
        if (response.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Task details fetched successfully.",
            data: response.rows[0]
        })
    }catch(error){
        console.error("Server error",error)
        return res.status(500).json({
            success:false,
            message:'Server error'
        })
    }

}