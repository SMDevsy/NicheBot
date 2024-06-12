import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

async function execute(interaction: ChatInputCommandInteraction) {
  interaction.reply("Pong!");
}

const pingCommand = new NicheBotCommand(data, execute);

export default pingCommand;
