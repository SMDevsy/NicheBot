const sqlite3 = require("sqlite3").verbose();
import fs from "fs";
import { Database } from "sqlite3";
import VideoData from "./music/VideoData";

const dbFilePath = "./nichebot.db";

export interface UrlCacheRow {
  videoId: string;
  filepath: string;
  createdAt: number;
}

type VideoDataCacheRow = VideoData & {
  createdAt: number;
};

class NicheDatabase {
  db: Database;
  constructor() {
    this.db = createDb();
  }

  private intoPromise<T>(statement: string, params: Array<any> = []) {
    const verb = statement.split(" ")[0];
    const fn = verb === "SELECT" ? this.db.get : this.db.run;
    console.log("Running statement", statement, params);
    console.log("With function", verb === "SELECT" ? "get" : "run");

    return new Promise<T | any>((resolve, reject) => {
      fn.call(this.db, statement, params, (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(verb === "SELECT" ? (rows as T) : true);
      });
    });
  }

  getUrls() {
    const statement = "SELECT * FROM url_cache";
    return this.intoPromise<UrlCacheRow[]>(statement);
  }

  getPathForId(videoId: string): Promise<UrlCacheRow | undefined> {
    const statement = "SELECT * FROM url_cache WHERE videoId = ?";
    const params = [videoId];
    return this.intoPromise<UrlCacheRow>(statement, params);
  }

  savePathForId(videoId: string, path: string) {
    const statement = "INSERT INTO url_cache(videoId, filepath) VALUES(?, ?)";
    const params = [videoId, path];
    return this.intoPromise<true>(statement, params);
  }

  getDataForId(videoId: string): Promise<VideoDataCacheRow | undefined> {
    const statement = "SELECT * FROM video_data_cache WHERE videoId = ?";
    const params = [videoId];
    return this.intoPromise<VideoDataCacheRow>(statement, params);
  }

  saveData(data: VideoData) {
    const statement =
      "INSERT INTO video_data_cache(videoId, title, authorName, channelUrl, url, thumbnailUrl, duration) VALUES(?, ?, ?, ?, ?, ?, ?)";
    const params = [
      data.videoId,
      data.title,
      data.authorName,
      data.channelUrl,
      data.url,
      data.thumbnailUrl,
      data.duration
    ];
    return this.intoPromise<true>(statement, params);
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
