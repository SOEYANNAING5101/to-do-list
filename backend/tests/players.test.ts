// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import request from 'supertest'
// import app from '../app.js'
// import pool from '../db/db.js'
// import { updatePlayer } from '../controllers/player.controller.js';

// // Mock database
// vi.mock('../db/db.js', () => {
//     return {
//         default: {
//             query: vi.fn()
//         }
//     }
// })

// describe("Player controller API tests", () => {
//     beforeEach(() => {
//         vi.resetAllMocks();
//     });
//     // Get Function
//     describe('GET /api/players (getAllPlayers', () => {
//         // Successful fetch players
//         it('should return status 200 and a list of players', async () => {
//             const mockDbData = [
//                 { player_id: '1', name: 'Eden Hazard', goals: 110, assists: 92 },
//                 { player_id: '2', name: 'Harry Kane', goals: 52, assists: 6 }
//             ];
//             (pool.query as any).mockResolvedValue({ rows: mockDbData })
//             const response = await request(app).get('/api/players')

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true)
//             expect(response.body.message).toBe('Successfully fetched player details')
//             expect(response.body.data).toEqual(mockDbData);

//             expect(pool.query).toHaveBeenCalledTimes(1)
//         })
//         // Database crashes
//         it('should return status 500 if the database crashes', async () => {
//             (pool.query as any).mockRejectedValue(new Error("Neon DB connection failed"));
//             const response = await request(app).get('/api/players');
//             expect(response.status).toBe(500);
//             expect(response.body.success).toBe(false)
//             expect(response.body.error).toBe('Failed to fetch players from the database.')
//         })
//     })
//     // POST Function(Create new player)
//     describe('POST /api/players (createPlayer)', () => {
//         // Successful POST function
//         it('should return status 200 and successfully create a new player', async () => {
//             const newPlayerPayLoad = {
//                 name: 'Kevin De Bruyne',
//                 goals: 250,
//                 assists: 300,
//             }
//             const fakedPlayer = {
//                 player_id: '3',
//                 ...newPlayerPayLoad,
//                 created_at: '2026-01-01'
//             };
//             (pool.query as any).mockResolvedValue({ rows: [fakedPlayer] })

//             const response = await request(app)
//                 .post('/api/players')
//                 .send(newPlayerPayLoad);
//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true)
//             expect(response.body.message).toBe("New Player saved successfully.")
//             expect(response.body.data).toEqual(fakedPlayer);

//             expect(pool.query).toHaveBeenCalledTimes(1)
//         });
//         // Validation failed
//         it('should return status 400 if validation fails (e.g. negative goals)', async () => {
//             const badPlayerPayLoad = {
//                 name: 'Kevin De Bruyne',
//                 goals: -250,
//                 assists: 300
//             };
//             const response = await request(app)
//                 .post('/api/players')
//                 .send(badPlayerPayLoad)
//             expect(response.status).toBe(400);
//             expect(response.body.error).toBe("Invalid data")
//             expect(response.body.details).toBeDefined();
//         })
//         // Database crashes
//         it('should return status 500 if the database crashes during insert', async () => {
//             const validPayload = { name: 'wayne rooney', goals: 208, assists: 103 };
//             (pool.query as any).mockRejectedValue(new Error("NEON DB connection failed"))

//             const response = await request(app)
//                 .post('/api/players')
//                 .send(validPayload)
//             expect(response.status).toBe(500)
//             expect(response.body.success).toBe(false)
//             expect(response.body.message).toBe("Failed to create player")
//         })


//     })
//     // PUT Function (Update the player stats(goals, assists))
//     describe('PUT /api/players (updatePlayer)', () => {
//         // Successful Update Player
//         it('should return status 200 and updated player data when successful', async () => {
//             const playerId = '1';
//             const updatedPayload = { goals: 500, assists: 250 };
//             const updatedPlayer = { player_id: playerId, name: 'Hazard', goals: 500, assists: 250 };
//             (pool.query as any).mockResolvedValueOnce({
//                 rowCount: 1,
//                 rows: [updatedPlayer]
//             });
//             const response = await request(app)
//                 .put(`/api/players/${playerId}`)
//                 .send(updatedPayload)

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.message).toBe(`Successfully updated ${playerId}`);
//             expect(response.body.data).toEqual(updatedPlayer);
//             expect(pool.query).toHaveBeenCalledTimes(1);
//         })
//         // Validation failed (e.g. Negative assist)
//         it('should return status 400 if validation fails', async () => {
//             const playerId = '1';
//             const badPlayload = { goals: 500, assists: -250 };
//             (pool.query as any).mockResolvedValueOnce({
//                 rowCount: 0,
//                 rows: []
//             });
//             const response = await request(app)
//                 .put(`/api/players/${playerId}`)
//                 .send(badPlayload);

//             expect(response.status).toBe(400);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("Invalid data")

//             expect(pool.query).not.toHaveBeenCalled()
//         });
//         // Player not found
//         it('should return status 404 if player does not exist in the database', async () => {
//             const wrongPlayerId = '999';
//             const validPayload = { goals: 500, assists: 250 };
//             (pool.query as any).mockResolvedValueOnce({ rowCount: 0, rows: [] });
//             const response = await request(app)
//                 .put(`/api/players/${wrongPlayerId}`)
//                 .send(validPayload);

//             expect(response.status).toBe(404);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("Player not found")

//             expect(pool.query).toHaveBeenCalledTimes(1)
//         });
//         // Database crashes
//         it('should return status 500 if database crashes', async () => {
//             const playerId = '1';
//             const validPayload = { goals: 500, assists: 250 };
//             (pool.query as any).mockRejectedValueOnce(new Error('NEON DB connection failed'));

//             const response = await request(app)
//                 .put(`/api/players/${playerId}`)
//                 .send(validPayload);

//             expect(response.status).toBe(500);
//             expect(response.body.success).toBe(false);
//             expect(response.body.error).toBe("Failed to update the player.")
//         });
//     })
// })

