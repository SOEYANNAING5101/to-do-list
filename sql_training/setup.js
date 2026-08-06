import pool from "./db.js";

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS clubs (
    club_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_name VARCHAR(100) NOT NULL,
    club_email VARCHAR(100) UNIQUE NOT NULL,
    stadium VARCHAR(100),
    trophies_won INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS players(
    player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    club_id UUID REFERENCES clubs(club_id) ON DELETE CASCADE
    );
`;
  try {
    console.log("Running table creation query...");
    await pool.query(queryText);
    console.log("Success! Tables created.");
  } catch (error) {
    console.error("Error creating tables: ", error);
  } finally {
    pool.end();
  }
};

createTables();
