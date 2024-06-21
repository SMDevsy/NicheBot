import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import BOT_STATE from "../BotState";

const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the queue");

async function execute(interaction) {
    BOT_STATE.songQueue.clear();
    await interaction.reply(`The queue has been cleared!`);
}

const clearCommand = new NicheBotCommand(data, execute);
export default clearCommand;
