import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { resolveQuery } from "./resolveQuery";

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
  console.log(`Playing ${query}`);
  const videos = await resolveQuery(query);
  console.log(videos);
  //await interaction.reply("Playing!" + query);
}

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

const playCommand = new NicheBotCommand(data, execute);
export default playCommand;
