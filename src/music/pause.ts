import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";

const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the current song");

async function execute(interaction) {
  const isPaused = NicheBot.audioPlayer._getPlayer().pause();
  await interaction.reply(`The player is now paused`);
}

const pauseCommand = new NicheBotCommand(data, execute);
export default pauseCommand;
