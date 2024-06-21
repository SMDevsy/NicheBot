import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel
} from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { resolveQuery } from "./resolveQuery";
import Fetcher from "./Fetcher";
import BOT_STATE from "../BotState";
import VideoData from "./VideoData";
import { createAudioResource } from "@discordjs/voice";
import joinCommand from "./join";
import SongQueue from "./SongQueue";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song or a playlist")
  .addStringOption(option =>
    option
      .setName("query")
      .setDescription("The song or playlist to play")
      .setRequired(true)
  );

async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("query", true);
  await interaction.reply("Working...");

  if (!BOT_STATE.voiceConnection) {
    joinCommand.execute(interaction);
  }

  let videos: (VideoData | null)[] = [];
  try {
    videos = await resolveQuery(query);
  } catch (e) {
    await interaction.editReply(
      "An error occured while processing the query: " + e
    );
    return;
  }

  console.log(videos);
  // erase null songs, for now there's no info that it was skipped. ADD LATER
  const filtered = videos.filter(v => v !== null) as VideoData[];

  if (filtered.length === 0) {
    await interaction.editReply(
      "No valid videos found! This may be due to age restrictions or internal errors."
    );
    return;
  }

  let queue = BOT_STATE.songQueue;

  if (!queue.isEmpty()) {
    queue.addSongs(filtered);
    interaction.editReply("Added songs to the queue!");
    return;
  }

  queue.addSongs(filtered);
  const audioPath = await Fetcher.fetchAudio(queue.currentSong()!);
  const resource = createAudioResource(audioPath);

  BOT_STATE.voiceConnection!.subscribe(BOT_STATE.audioPlayer._getPlayer());
  BOT_STATE.audioPlayer.play(resource);

  await interaction.editReply(
    `Playing ${BOT_STATE.songQueue.currentSong()!.title}`
  );
}

const playCommand = new NicheBotCommand(data, execute);
export default playCommand;
