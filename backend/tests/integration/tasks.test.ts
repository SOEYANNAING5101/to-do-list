import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest'
import app from '../../app.js'
import pool from '../../db/db.js'


vi.mock('../db/db.js', () => {
    return {
        default: {
            query: vi.fn()
        }
    }
});
describe("GET /api/task/:id", () => {
    it('should return status 404 if task id is not found', async () => {
        const fakedId = '123e4567-e89b-12d3-a456-426614174000';
        const response = await request(app).get(`/api/tasks/${fakedId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("Task not found")
    });
    it('should return status 200 and the task data if the task is found', async () => {

        const insertQuery = `
        INSERT INTO tasks (title,description,is_completed)
        VALUES ($1,$2,$3)
        RETURNING *`;
        const tempTaskRes = await pool.query(insertQuery, [
            'exercise',
            'running: 1hr, jogging: 1hr',
            false
        ])
        const realTaskId = tempTaskRes.rows[0].task_id;

        const response = await request(app).get(`/api/tasks/${realTaskId}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Task details fetched successfully.");
        expect(response.body.data.title).toBe("exercise");
        expect(response.body.data.is_completed).toBe(false);

        await pool.query(`DELETE FROM tasks WHERE task_id = $1`, [realTaskId])
    })
    it('should return status 500 if database crashes', async () => {
        vi.spyOn(pool, 'query').mockRejectedValueOnce(new Error("Neon Database connection failed."));
        const fakedId = '123e4567-e89b-12d3-a456-426614174000';
        const response = await request(app).get(`/api/tasks/${fakedId}`);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("Server error")

        vi.restoreAllMocks();
    })
});