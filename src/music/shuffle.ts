import { SlashCommandBuilder } from "discord.js";
import NicheBot from "../NicheBot";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue");

async function execute(interaction) {
  NicheBot.songQueue.shuffle();
  await interaction.reply("Shuffled the queue!");
}

const shuffleCommand = new NicheBotCommand(data, execute);
export default shuffleCommand;
