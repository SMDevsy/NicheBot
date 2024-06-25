const sqlite3 = require("sqlite3").verbose();
import fs from "fs";
import { Database } from "sqlite3";
import VideoData from "./music/VideoData";

const dbFilePath = "./nichebot.db";

type UrlCacheRow = {
  videoId: string;
  filepath: string;
  createdAt: number;
};

type VideoDataCacheRow = VideoData & {
  createdAt: number;
};

type PlaylistVideosCacheRow = {
  id: number;
  playlistId: string;
  videoId: string;
  idx: number;
  createdAt: number;
  updatedAt: number;
};

type PlaylistRow = {
  id: number;
  playlistId: string;
  createdAt: number;
  updatedAt: number;
  ttl: number;
};

enum QueryKind {
  All = "all",
  One = "get",
  Run = "run"
}

class NicheDatabase {
  db: Database;
  constructor() {
    this.db = createDb();
  }

  private intoPromise<T>(
    statement: string,
    params: Array<any> = [],
    kind: QueryKind
  ) {
    const fn = this.db[kind];
    console.log("Running statement", statement, params);
    console.log("With function", kind);

    return new Promise<T | any>((resolve, reject) => {
      fn.call(this.db, statement, params, (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(kind !== QueryKind.Run ? (rows as T) : true);
      });
    });
  }

  getUrls() {
    const statement = "SELECT * FROM url_cache";
    return this.intoPromise<UrlCacheRow[]>(statement, [], QueryKind.All);
  }

  getPathForId(videoId: string): Promise<UrlCacheRow | undefined> {
    const statement = "SELECT * FROM url_cache WHERE videoId = ?";
    const params = [videoId];
    return this.intoPromise<UrlCacheRow>(statement, params, QueryKind.One);
  }

  savePathForId(videoId: string, path: string) {
    const statement = "INSERT INTO url_cache(videoId, filepath) VALUES(?, ?)";
    const params = [videoId, path];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
  }

  /**
   * Get all videoIds for a playlist
   * @param playlistId The ID of the playlist
   * @returns A promise that resolves to an array of PlaylistCacheRow
   */
  getPlaylist(playlistId: string): Promise<PlaylistRow | undefined> {
    const statement = "SELECT * FROM playlist WHERE playlistId = ?";
    const params = [playlistId];
    return this.intoPromise<PlaylistRow | undefined>(
      statement,
      params,
      QueryKind.One
    );
  }

  /**
   * Save the playlist entry with a TTL
   * @param playlistId The ID of the playlist
   * @returns A promise that resolves to true
   */
  savePlaylist(playlistId: string) {
    const statement = "INSERT INTO playlist(playlistId) VALUES(?)";
    const params = [playlistId];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
  }

  getVideosForPlaylist(playlistId: string): Promise<PlaylistVideosCacheRow[]> {
    const statement =
      "SELECT * FROM playlist_videos_cache p WHERE playlistId = ? order by p.idx";
    const params = [playlistId];
    return this.intoPromise<PlaylistVideosCacheRow[]>(
      statement,
      params,
      QueryKind.All
    );
  }

  saveVideoForPlaylist(playlistId: string, videoId: string, idx: number) {
    const statement =
      "INSERT INTO playlist_videos_cache(playlistId, videoId, idx) VALUES(?, ?, ?)";
    const params = [playlistId, videoId, idx];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
  }

  deleteVideosForPlaylist(playlistId: string) {
    const statement = "DELETE FROM playlist_videos_cache WHERE playlistId = ?";
    const params = [playlistId];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
  }

  deletePlaylist(playlistId: string) {
    const statement = "DELETE FROM playlist WHERE playlistId = ?";
    const params = [playlistId];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
  }

  getDataForId(videoId: string): Promise<VideoDataCacheRow | undefined> {
    const statement = "SELECT * FROM video_data_cache WHERE videoId = ?";
    const params = [videoId];
    return this.intoPromise<VideoDataCacheRow>(
      statement,
      params,
      QueryKind.One
    );
  }

  saveData(data: VideoData) {
    const statement =
      "INSERT OR REPLACE INTO video_data_cache(videoId, title, authorName, channelUrl, url, thumbnailUrl, duration) VALUES(?, ?, ?, ?, ?, ?, ?)";
    const params = [
      data.videoId,
      data.title,
      data.authorName,
      data.channelUrl,
      data.url,
      data.thumbnailUrl,
      data.duration
    ];
    return this.intoPromise<true>(statement, params, QueryKind.Run);
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
