import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import VideoData from "./VideoData";
import { log } from "../log";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song or a playlist")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The song or playlist to play")
      .setRequired(true),
  );

async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("query", true);
  await interaction.reply("Working...");

  await NicheBot.joinChannel(interaction);

  let videos: VideoData[] = [];
  try {
    videos = await NicheBot.handleQuery(interaction, query);
  } catch (e) {
    log.error(e);
    return;
  }

  log.info(`Adding ${videos.length} songs to the queue...`);

  let queue = NicheBot.songQueue;
  if (!queue.isEmpty()) {
    queue.addSongs(videos);
    interaction.editReply("Added songs to the queue!");
    return;
  }

  queue.addSongs(videos);
  NicheBot.downloadAndPlayCurrent(interaction);
}

const playCommand = new NicheBotCommand(data, execute);
export default playCommand;
