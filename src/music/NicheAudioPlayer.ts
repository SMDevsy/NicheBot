import {
  AudioPlayer,
  AudioResource,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource
} from "@discordjs/voice";
import NicheBot from "../NicheBot";
import Fetcher from "./Fetcher";
import { log } from "../log";

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
        log.info("Song playback finished");
        const nextSong = NicheBot.songQueue.nextSong();
        if (!nextSong) {
          log.warn("Queue is empty");
          return;
        }
        log.info(`Playing ${nextSong.title}`);
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
