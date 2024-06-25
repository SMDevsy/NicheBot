import Fetcher from "./Fetcher";
import VideoData, { VideoDataResponses } from "./VideoData";
import UrlValidator from "./UrlValidator";
import { log } from "../log";

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
  if (!UrlValidator.isValidHttpUrl(query)) {
    throw new Error(
      "Search queries not supported yet. Please use a YouTube URL."
    );
  }

  const url = new URL(query);

  // is the query a youtube link?
  if (!UrlValidator.isValidYoutubeUrl(url)) {
    throw new Error("Not a YouTube URL");
  }

  // is the query a playlist?
  if (UrlValidator.isPlaylistUrl(url)) {
    const listId = url.searchParams.get("list")!;
    const index = parseInt(url.searchParams.get("index")!);
    const playlist = await Fetcher.fetchPlaylist(listId);
    return playlist.slice(index - 1, playlist.length - 1);
  }

  // single video
  try {
    const ytData = await Fetcher.fetchInfo(url);
    return [ytData];
  } catch (err) {
    log.error(err);
    return [];
  }
}
