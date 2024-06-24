import { PlaylistVideo, YouTubeData } from "yt-stream";
import Fetcher from "./Fetcher";

export default interface VideoData {
  readonly videoId: string;
  readonly title: string;
  readonly authorName: string;
  readonly channelUrl: string;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly duration: number;
};

export type VideoDataResponses = (VideoData | null)[];

export default class VideoData {
  static fromSingleYtItem(data: YouTubeData): VideoData {
    return {
      videoId: data.id,
      title: data.title,
      authorName: data.channel.author,
      channelUrl: data.channel.url,
      url: data.url,
      duration: data.duration,
      thumbnailUrl: data.default_thumbnail.url
    };
  }

  // fetch additional data for playlist items, they lack data about the channel
  static async fromPlaylistYtItem(
    data: PlaylistVideo
  ): Promise<VideoData | null> {
    try {
      const url = new URL(data.video_url);
      const details = await Fetcher.fetchInfo(url);
      return details;
    } catch (err) {
      // the video is probably age restricted
      console.error(err);
      return null;
    }
  }
}
