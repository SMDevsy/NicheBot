import { createAudioResource, VoiceConnection } from "@discordjs/voice";
import SongQueue from "./music/SongQueue";
import NicheAudioPlayer from "./music/NicheAudioPlayer";
import Fetcher from "./music/Fetcher";
import joinCommand from "./music/join";
import { log } from "./log";
import VideoData, { VideoDataResponses } from "./music/VideoData";
import { resolveQuery } from "./music/resolveQuery";

class NicheBotClass {
  voiceConnection: VoiceConnection | null = null;
  songQueue: SongQueue = new SongQueue();
  audioPlayer: NicheAudioPlayer = new NicheAudioPlayer();
  disconnect() {
    this.voiceConnection?.destroy();
    this.voiceConnection = null;
    this.songQueue.clear();
  }
  downloadAndPlayCurrent(interaction?) {
    Fetcher.fetchAudio(this.songQueue.currentSong()!).then((path) => {
      const resource = createAudioResource(path);
      NicheBot.voiceConnection!.subscribe(NicheBot.audioPlayer._getPlayer());
      NicheBot.audioPlayer.play(resource);
      interaction?.editReply(
        `Playing ${NicheBot.songQueue.currentSong()!.title}`,
      );
    });
  }
  async joinChannel(interaction) {
    if (!NicheBot.voiceConnection) {
      joinCommand.execute(interaction);
      // active wait (every 50ms but still) until the bot joins the voice channel
      while (!NicheBot.voiceConnection) {
        await new Promise((r) => setTimeout(r, 50));
      }
      log.debug("After active wait");
    }
  }

  async handleQuery(interaction, query: string): Promise<VideoData[]> {
    let videos: VideoDataResponses = [];
    try {
      videos = await resolveQuery(query);
    } catch (e) {
      const s = "An error occured while processing the query:" + e;
      await interaction.editReply(s);
      throw new Error(s);
    }
    // erase null songs, for now there's no info that it was skipped. ADD LATER
    const filtered = videos.filter((v) => v !== null) as VideoData[];
    if (filtered.length === 0) {
      await interaction.editReply(
        "No valid videos found! This may be due to age restrictions or internal errors.",
      );
      throw new Error("No valid videos found!");
    }
    return filtered;
  }
  constructor() {}
}

let NicheBot = new NicheBotClass();

export default NicheBot;
