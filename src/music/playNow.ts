import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import joinCommand from "./join";
import VideoData from "./VideoData";
import { resolveQuery } from "./resolveQuery";
import Fetcher from "./Fetcher";
import { createAudioResource } from "@discordjs/voice";
import { log } from "../log";

const data = new SlashCommandBuilder()
  .setName("playnow")
  .setDescription("Play a song immediately")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The song to play")
      .setRequired(true),
  )
  .addBooleanOption((option) =>
    option
      .setName("skip")
      .setDescription("Skip the current song")
      .setRequired(false),
  );

async function execute(interaction) {
  const query = interaction.options.getString("query", true);
  const skip = interaction.options.getBoolean("skip") ?? false;
  await interaction.reply(`Working...`);

  await NicheBot.joinChannel(interaction);

  let videos: VideoData[] = [];
  try {
    videos = await NicheBot.handleQuery(interaction, query);
  } catch (e) {
    log.error(e);
    return;
  }

  let queue = NicheBot.songQueue;
  let oldQueueLength = queue.getQueue().length;
  queue.addSongsAt(videos, 1);
  await interaction.editReply("Added song to the queue!");

  // just append to the beggining of the queue
  if (!skip && oldQueueLength > 0) {
    log.info("PlayNow - Added song(s) to the queue");
    return;
  }

  // For some reason the user used `playnow` like `play`, to initiate the playback
  if (!skip && oldQueueLength === 0) {
    log.info("PlayNow - Playing song immediately");
    NicheBot.downloadAndPlayCurrent(interaction);
    return;
  }

  // skip only if the queue wasnt empty. Otherwise we'd skip one of the new songs
  if (oldQueueLength > 0) {
    log.info("PlayNow - Skipping current song");
    queue.skipSongs(1);
  }

  // by now we know skip is true, no if
  log.info("Playing next song immediately");
  NicheBot.downloadAndPlayCurrent(interaction);
}

const playNowCommand = new NicheBotCommand(data, execute);
export default playNowCommand;
