import { SlashCommandBuilder } from "discord.js";
import BOT_STATE from "../BotState";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue");

async function execute(interaction) {
  BOT_STATE.songQueue.shuffle();
  await interaction.reply("Shuffled the queue!");
}

const shuffleCommand = new NicheBotCommand(data, execute);
export default shuffleCommand;
