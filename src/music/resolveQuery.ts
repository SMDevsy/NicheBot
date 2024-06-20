import Fetcher from "./Fetcher";
import VideoData, { VideoDataResponses } from "./VideoData";
import UrlValidator from "./UrlValidator";


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
    throw new Error("Queries not supported yet");
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
    const playlistData = await Fetcher.fetchPlaylist(listId);
    const videoData = playlistData.map(VideoData.fromPlaylistYtItem);
    const playlist = await Promise.all(videoData);
    return playlist.slice(index - 1, playlist.length - 1);
  }

  // single video
  const ytData = await Fetcher.fetchInfo(url);
  return [VideoData.fromSingleYtItem(ytData)];
}
