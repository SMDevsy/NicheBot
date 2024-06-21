import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";

const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the current song");

async function execute(interaction) {
  const isPaused = NicheBot.audioPlayer._getPlayer().unpause();
  await interaction.reply(`The player is now unpaused`);
}

const resumeCommand = new NicheBotCommand(data, execute);
export default resumeCommand;
