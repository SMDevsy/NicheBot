import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceChannel } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { resolveQuery } from "./resolveQuery";
import Fetcher from "./Fetcher";
import BOT_STATE from "../BotState";
import VideoData from "./VideoData";
import { createAudioResource } from "@discordjs/voice";
import joinCommand from "./join";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song or a playlist")
  .addStringOption(option =>
    option
      .setName("query")
      .setDescription("The song or playlist to play")
      .setRequired(true)
  );

async function execute(interaction: ChatInputCommandInteraction | any) {
  const query = interaction.options.getString("query", true);
  await interaction.reply("Working...");

  if (!BOT_STATE.voiceConnection) {
    joinCommand.execute(interaction);
  }
  
  let videos: (VideoData | null)[] = [];
  try {
    videos = await resolveQuery(query);
  } catch (e: any) {
    await interaction.editReply("An error occured while processing the query: " + e.message);; 
    return;
  }
  
  console.log(videos);
  if (videos.length === 0 || videos.every(v => v === null)) {
    await interaction.editReply("No valid videos found! This may be due to age restrictions or internal errors.");
    return;
  }
  
  // for now, just overwrite the queue.
  // erase null songs, for now there's no info that it was skipped. ADD LATER
  BOT_STATE.songQueue = videos.filter(v => v !== null) as VideoData[];
  const audioPath = await Fetcher.fetchAudio(BOT_STATE.songQueue[0]);
  console.log(audioPath);
  
  const resource = createAudioResource(audioPath);
  
  BOT_STATE.voiceConnection?.subscribe(BOT_STATE.audioPlayer!);
  BOT_STATE.audioPlayer?.play(resource);
  
  await interaction.editReply(`Playing ${BOT_STATE.songQueue[0].title}`);
}

const playCommand = new NicheBotCommand(data, execute);
export default playCommand;
