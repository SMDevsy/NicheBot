import VideoData, { VideoDataResponses } from "./VideoData";

export const ytstream = require("yt-stream");

function isValidHttpUrl(string): boolean {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function isValidYoutubeUrl(url: URL): boolean {
  const validHosts = ["www.youtube.com", "youtu.be"];
  return validHosts.includes(url.hostname);
}

async function resolveSearchQuery(query: string): Promise<URL[]> {
  throw new Error("Unimplemented");
}

/**
 * Resolves a YouTube playlist to a list of URLs or nulls if it failed.
 * @param listId The ID of the YouTube playlist to resolve
 * @returns A list of short URLs that the playlist resolves to
 */
async function resolveYoutubePlaylist(
  listId: string
): Promise<VideoDataResponses> {
  const url = `https://www.youtube.com/playlist?list=${listId}`;
  const playlistInfo = await ytstream.getPlaylist(url);
  const videoData = playlistInfo.videos.map(VideoData.fromPlaylistYtItem);
  return await Promise.all(videoData);
}

/**
 * Resolves a query string to a list of URLs.
 The query can be a URL, some search keywords, or a playlist.
 * @param query The query string to resolve
 * @returns A list of URLs that the query string resolves to
 * @throws If the query string is invalid
 */
export async function resolveQuery(query: string): Promise<VideoDataResponses> {
  // is the query a URL?
  if (!isValidHttpUrl(query)) {
    throw new Error("Queries not supported yet");
  }

  const url = new URL(query);

  // is the query a youtube link?
  if (!isValidYoutubeUrl(url)) {
    throw new Error("Not a YouTube URL");
  }

  // is the query a playlist?
  if (url.searchParams.has("list")) {
    console.log("Query is a youtube playlist");
    const listId = url.searchParams.get("list")!;
    const index = url.searchParams.get("index");
    return await resolveYoutubePlaylist(listId);
  } else {
    console.log("Query is a single video");
    try {
      const info = await ytstream.getInfo(query);
      const data = VideoData.fromSingleYtItem(info);
      console.log(data);
      return [data];
    } catch (err) {
      console.log("Failed to fetch video data");
      return [null];
    }
  }
}
