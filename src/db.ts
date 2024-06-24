const sqlite3 = require("sqlite3").verbose();
import fs from "fs";
import { Database } from "sqlite3";

const dbFilePath = "./nichebot.db";

export interface UrlCacheRow {
  videoId: string;
  filepath: string;
  created_at: string;
}

class NicheDatabase {
  db: Database;
  constructor() {
    this.db = createDb();
  }

  getUrls() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM url_cache", (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows as UrlCacheRow[]);
      });
    });
  }

  getPathForId(videoId: string): Promise<UrlCacheRow | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM url_cache WHERE video_id = ?",
        [videoId],
        (error, row) => {
          if (error) {
            reject(error);
          }
          resolve(row as any);
        }
      );
    });
  }

  savePathForId(videoId: string, path: string) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO url_cache(video_id, filepath) VALUES(?, ?)",
        [videoId, path],
        error => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }
}

function createDb() {
  // Check if the database file exists
  if (fs.existsSync(dbFilePath)) {
    return new sqlite3.Database(dbFilePath);
  }

  // Create the database if it doesn't exist
  const db = new sqlite3.Database(dbFilePath, error => {
    if (error) {
      return console.error(error.message);
    }
  });
  console.log("Creating tables");
  createTables(db);
  console.log("Connection with SQLite has been established");
  return db;
}

function createTables(db: Database) {
  console.log(process.cwd());
  const statements = fs.readFileSync("./src/db.sql").toString();
  console.log(statements);
  db.exec(statements);
}

const NicheDb = new NicheDatabase();
export default NicheDb;
