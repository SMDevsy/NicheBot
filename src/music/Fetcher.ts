import { PlaylistVideo, YouTubeData } from "yt-stream";
import VideoData, { VideoDataResponses } from "./VideoData";
import { createWriteStream } from "fs";
import ytdlp from "ytdlp-nodejs";

const ytstream = require("yt-stream");
const fs = require("fs");

import YTDlpWrap from "yt-dlp-wrap";
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

  static async fetchInfo(url: URL): Promise<YouTubeData> {
    console.log("Fetching info");
    return await ytstream.getInfo(url.href);
  }

  static async fetchAudio(video: VideoData): Promise<string> {
    const fileName = "./download/" + video.title + ".mp3";
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
    return fileName;
  }
}
