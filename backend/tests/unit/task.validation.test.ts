import { describe, it, expect, vi,beforeEach } from 'vitest';
import { exactOptional, z } from 'zod';
import pool from '../../db/db.js'
import request from 'supertest'
import app from '../../app.js'

vi.mock('../../db/db.js', () => {
    return {
        default: {
            query: vi.fn()
        }
    }
});

describe('Task controller API test', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    describe('GET /api/tasks/:id (getTaskById)', () => {
        it('should return status 200 and task details if the task is found', async () => {
            const taskId = '1';
            const mockDbData = {
                task_id: taskId,
                title: 'exercise',
                description: 'running:1hr, jogging:1hr',
                is_completed: false
            };
            (pool.query as any).mockResolvedValue({
                rowCount: 1,
                rows: [mockDbData]
            });
            const response = await request(app).get(`/api/tasks/${taskId}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Task details fetched successfully.");
            expect(response.body.data).toEqual(mockDbData);

            expect(pool.query).toHaveBeenCalledTimes(1)
        });
        it('should return status 404 if task id is not found', async () => {
            const fakeId = '999';
            (pool.query as any).mockResolvedValue({
                rowCount: 0,
                rows: []
            })
            const response = await request(app).get(`/api/tasks/${fakeId}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Task not found");

            expect(pool.query).toHaveBeenCalledTimes(1)
        })
        it('should return status 500 if database crashes',async()=>{
            const fakeId= '1';
            (pool.query as any).mockRejectedValue(new Error ("Database connection failed"));
            const response = await request(app).get(`/api/tasks/${fakeId}`);
            expect(response.status).toBe(500)
            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe('Server error')
            expect(pool.query).toHaveBeenCalledTimes(1)
        })
    })

})
