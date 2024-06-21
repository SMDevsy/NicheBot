import { VoiceConnection } from "@discordjs/voice";
import SongQueue from "./music/SongQueue";
import NicheAudioPlayer from "./music/NicheAudioPlayer";

class BotState {
  voiceConnection: VoiceConnection | null = null;
  songQueue: SongQueue = new SongQueue();
  audioPlayer: NicheAudioPlayer = new NicheAudioPlayer();
  disconnect() {
    this.voiceConnection?.destroy();
    this.voiceConnection = null;
    this.songQueue.clear();
  }
  constructor() {}
}

let BOT_STATE = new BotState();

export default BOT_STATE;
