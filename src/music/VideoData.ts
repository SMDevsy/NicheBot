import { PlaylistVideo, YouTubeData } from "yt-stream";
import Fetcher from "./Fetcher";

interface VideoAuthor {
  name: string;
  channelUrl: string;
}

export default interface VideoData {
  readonly title: string;
  readonly author: VideoAuthor;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly duration: string;
};

export type VideoDataResponses = (VideoData | null)[];

export default class VideoData {
  static fromSingleYtItem(data: YouTubeData): VideoData {
    return {
      title: data.title,
      author: {
        name: data.channel.author,
        channelUrl: data.channel.url
      },
      url: data.url,
      duration: data.duration.toString(),
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
      return VideoData.fromSingleYtItem(details);
    } catch (err) {
      // the video is probably age restricted
      console.error(err);
      return null;
    }
  }
}
