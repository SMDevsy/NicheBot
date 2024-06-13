import {
  AudioPlayer,
  NoSubscriberBehavior,
  VoiceConnection,
  createAudioPlayer
} from "@discordjs/voice";
import VideoData from "./music/VideoData";

class BotState {
  isInChannel: boolean = false;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  isLooping: boolean = false;
  isShuffling: boolean = false;
  voiceConnection: VoiceConnection | null = null;
  songQueue: Array<VideoData> = [];
  audioPlayer: AudioPlayer | null = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause
    }
  });

  constructor() {}
}

let BOT_STATE = new BotState();

export default BOT_STATE;
