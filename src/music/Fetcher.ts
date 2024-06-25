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
  static async fetchPlaylist(listId: string): Promise<PlaylistVideo[]> {
    console.log("Fetching playlist");
    const url = `https://www.youtube.com/playlist?list=${listId}`;
    const info = (await ytstream.getPlaylist(url)) as PlayListInfo;
    console.log("Playlist info");
    return info.videos;
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
