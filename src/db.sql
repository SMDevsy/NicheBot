CREATE TABLE url_cache (
        videoId TEXT PRIMARY KEY,
        filepath TEXT NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch())
);

CREATE TABLE playlist_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlistUrl TEXT NOT NULL,
        videoId TEXT NOT NULL,
        idx INTEGER NOT NULL, -- song index on the playlist
        createdAt INTEGER DEFAULT (unixepoch()),
        updatedAt INTEGER DEFAULT (unixepoch()),
        ttl INTEGER DEFAULT 259200 -- 3 days in seconds
);

CREATE TABLE video_data_cache (
       videoId TEXT PRIMARY KEY,
       title TEXT NOT NULL,
       authorName TEXT NOT NULL,
       channelUrl TEXT NOT NULL,
       url TEXT NOT NULL,
       thumbnailUrl TEXT NOT NULL,
       duration INTEGER NOT NULL,
       createdAt INTEGER DEFAULT (unixepoch())
);
