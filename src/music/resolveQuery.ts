import Fetcher from "./Fetcher";
import VideoData, { VideoDataResponses } from "./VideoData";

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
 * Resolves a query string to a list of URLs.
 The query can be a URL, some search keywords, or a playlist.
 * @param query The query string to resolve
 * @returns A list of URLs that the query string resolves to
 * @throws If the query string is invalid
 */
export async function resolveQuery(query: string): Promise<VideoDataResponses> {
  // is the query a URL?
  if (!isValidHttpUrl(query)) {
    throw new Error(
      "Search queries not supported yet. Please use a YouTube URL."
    );
  }

  const url = new URL(query);

  // is the query a youtube link?
  if (!isValidYoutubeUrl(url)) {
    throw new Error("Not a YouTube URL");
  }

  // is the query a playlist?
  if (url.searchParams.has("list")) {
    const listId = url.searchParams.get("list")!;
    const index = parseInt(url.searchParams.get("index")!);
    const playlistData = await Fetcher.fetchPlaylist(listId);
    const videoData = playlistData.map(VideoData.fromPlaylistYtItem);
    const playlist = await Promise.all(videoData);
    return playlist.slice(index - 1, playlist.length - 1);
  }

  // single video
  try {
    const ytData = await Fetcher.fetchInfo(url);
    return [VideoData.fromSingleYtItem(ytData)];
  } catch (err) {
    console.error(err);
    return [];
  }
}
