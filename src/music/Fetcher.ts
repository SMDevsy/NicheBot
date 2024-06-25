import { PlaylistVideo, YouTubeData } from "yt-stream";
import VideoData, { VideoDataResponses } from "./VideoData";
import { createWriteStream } from "fs";
import ytdlp from "ytdlp-nodejs";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 10 });

const ytstream = require("yt-stream");
const fs = require("fs");

import YTDlpWrap from "yt-dlp-wrap";
import NicheDb from "../db";
import UrlValidator from "./UrlValidator";
const ytdlpWrap = new YTDlpWrap();

interface PlayListInfo {
  videos: PlaylistVideo[];
  title?: string;
  author?: string;
}

export default class Fetcher {
  /**
   * Resolves a YouTube playlist to a list of URLs or nulls if it failed.
   * @param listId The ID of the YouTube playlist to resolve
   * @returns A list of short URLs that the playlist resolves to
   */
  static async fetchPlaylist(listId: string): Promise<VideoDataResponses> {
    console.log("Fetching playlist");
    const url = `https://www.youtube.com/playlist?list=${listId}`;

    const playlistRow = await NicheDb.getPlaylist(listId);
    const isExpired =
      playlistRow && playlistRow.createdAt + playlistRow.ttl > Date.now();

    // known playlist
    if (playlistRow && !isExpired) {
      console.log(`Found cached playlist data for ${listId}`);
      const result = await NicheDb.getVideosForPlaylist(listId);
      const playlistVideos = [result].flat();
      console.log(result);
      console.log(playlistVideos, playlistVideos.length);

      // get all the videos that were fetched successfully from db
      const videoPromises = playlistVideos.map(video =>
        NicheDb.getDataForId(video.videoId)
      );

      const videos = (await Promise.all(videoPromises)).map(
        v => v! as VideoData
      );

      return videos;
    }

    if (playlistRow && isExpired) {
      console.log(
        `Found EXPIRED cached playlist data for ${listId}, deleting...`
      );
      await NicheDb.deleteVideosForPlaylist(listId);
      await NicheDb.deletePlaylist(listId);
      console.log(`Deleted playlist data for ${listId}`);
      console.log(`Fetching playlist data for ${listId} again`);
    }

    const info = (await ytstream.getPlaylist(url)) as PlayListInfo;
    const videoData = info.videos.map(VideoData.fromPlaylistYtItem);
    const videos = await Promise.all(videoData);

    // save the playlist entry with a TTL
    await NicheDb.savePlaylist(listId);

    // save the videos that were fetched successfully and assign them to the playlist
    videos.filter(v => v !== null).map(async data => {
      const videoData = data!.videoData;
      await NicheDb.saveVideoForPlaylist(listId, videoData.videoId, data!.idx);
      await NicheDb.saveData(videoData);
    });

    // return just the video data, sometimes null
    return videos.map(v => (v ? v.videoData : null));
  }

  static async fetchInfo(url: URL): Promise<VideoData> {
    const videoId = UrlValidator.extractVideoId(url);
    console.log(`Extracted video ID: ${videoId}`);
    const cachedData = (await NicheDb.getDataForId(videoId)) as VideoData;
    console.log(cachedData);
    if (cachedData) {
      console.log(`Found cached data for ${url.href}`);
      return cachedData;
    }

    console.log("Video data not cached, fetching...");
    const fetchedData = await ytstream.getInfo(url.href);
    const videoData = VideoData.fromSingleYtItem(fetchedData);
    console.log(videoData);
    await NicheDb.saveData(videoData);
    console.log(`Saved data for ${videoData.title} in the database`);

    return videoData;
  }

  private static normalizeTitle(title: string): string {
    return (
      title
        .replace(/'|"/gi, "")
        .replace(/[\/ —-]/gi, "_")
        .replace(/[_]+/gi, "_") +
      "_" +
      randomUUID()
    );
  }

  static async fetchAudio(video: VideoData): Promise<string> {
    const cachedPath = await NicheDb.getPathForId(video.videoId);
    if (cachedPath) {
      console.log(`Found cached path for ${video.title}`);
      console.log(cachedPath);
      return cachedPath.filepath;
    }

    const fileName = "./download/" + this.normalizeTitle(video.title) + ".mp3";
    await ytdlpWrap.execPromise([
      video.url,
      "--format",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--output",
      fileName
    ]);

    console.log(`Downloaded ${video.title}`);
    await NicheDb.savePathForId(video.videoId, fileName);
    console.log(`Saved path for ${video.title} in the database`);
    return fileName;
  }
}
