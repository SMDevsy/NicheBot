import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

async function execute(interaction: CommandInteraction) {
  interaction.reply("Pong!");
}

const pingCommand: NicheBotCommand = {
  data,
  execute
};

export default pingCommand;
