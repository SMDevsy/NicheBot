import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { resolveQuery } from "./resolveQuery";
import Fetcher from "./Fetcher";

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
  const videos = await resolveQuery(query);
  console.log(videos);
  await Fetcher.fetchAudio(videos[0]!);
  await interaction.editReply("Successfully fetched YouTube Info");
}

const playCommand = new NicheBotCommand(data, execute);
export default playCommand;
