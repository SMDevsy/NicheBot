import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";

const data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the queue");

async function execute(interaction) {
    NicheBot.songQueue.clear();
    await interaction.reply(`The queue has been cleared!`);
}

const clearCommand = new NicheBotCommand(data, execute);
export default clearCommand;
