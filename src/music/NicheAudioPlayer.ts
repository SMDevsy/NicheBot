import {
  AudioPlayer,
  AudioResource,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource
} from "@discordjs/voice";
import BOT_STATE from "../BotState";
import Fetcher from "./Fetcher";

export default class NicheAudioPlayer {
  private player: AudioPlayer;
  constructor() {
    const player: AudioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    });

    player.addListener("stateChange", async (oldState, newState) => {
      if (newState.status == "idle") {
        console.log("Song playback finished");
        const nextSong = BOT_STATE.songQueue.nextSong();
        if (!nextSong) {
          console.log("Queue is empty");
          return;
        }
        console.log("Playing next song");
        console.log(nextSong);
        const audioPath = await Fetcher.fetchAudio(nextSong);
        const resource = createAudioResource(audioPath);
        this.player.play(resource);
      }
    });

    this.player = player;
  }

  play(resource: AudioResource) {
    this.player.play(resource);
  }

  // use carefully
  _getPlayer() {
    return this.player;
  }
}
