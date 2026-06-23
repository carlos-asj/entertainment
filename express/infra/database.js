import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

let db;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "database.db");

function createTable(instanceDb) {
  instanceDb.exec(`
      CREATE TABLE IF NOT EXISTS series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        seasons INTEGER NOT NULL,
        episodes INTEGER NOT NULL,
        streaming TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
      `);
  console.log("-> 'series' table created!");

  instanceDb.exec(`
      CREATE TABLE IF NOT EXISTS progress_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_serie INTEGER NOT NULL,
        seasons_now INTEGER NOT NULL DEFAULT 1,
        episodes_now INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'Quero assistir',
        note NUMERIC,
        begin TIMESTAMP,
        streaming TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (id_serie) REFERENCES series (id) ON DELETE CASCADE
      )
      `);
  console.log("-> 'progress' table created!");
}

export function ConnDB() {
  if (!db) {
    db = new Database(dbPath);
    db.exec("PRAGMA foreign_keys = ON;");
    console.log("Database open!");

    createTable(db);
  }
  return db;
}
