import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import BOT_STATE from "../BotState";

const data = new SlashCommandBuilder()
  .setName("loop")
  .setDescription("Loops the current song");

async function execute(interaction) {
  const isLooping = BOT_STATE.songQueue.toggleLooping();
  await interaction.reply(
    `Looping is now ${isLooping ? "enabled" : "disabled"}`
  );
}

const loopCommand = new NicheBotCommand(data, execute);
export default loopCommand;
