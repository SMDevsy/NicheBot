import { VoiceConnection } from "@discordjs/voice";

class BotState {
  isInChannel: boolean = false;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  isLooping: boolean = false;
  isShuffling: boolean = false;
  voiceConnection: VoiceConnection | null = null;

  constructor() {}
}

let BOT_STATE = new BotState();

export default BOT_STATE;
