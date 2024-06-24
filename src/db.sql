CREATE TABLE url_cache (
        video_id TEXT PRIMARY KEY,
        filepath TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE playlist_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_url TEXT NOT NULL,
        video_id TEXT NOT NULL,
        idx INTEGER NOT NULL, -- song index on the playlist
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch()),
        ttl INTEGER DEFAULT 259200 -- 3 days in seconds
);
