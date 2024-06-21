import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT_STATE from "../BotState";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show the current queue");

async function execute(interaction: ChatInputCommandInteraction) {
  if (!BOT_STATE.voiceConnection) {
    await interaction.reply("I'm not in a voice channel!");
    return;
  }

  if (BOT_STATE.songQueue.isEmpty()) {
    await interaction.reply("The queue is empty!");
    return;
  }

  const reply = BOT_STATE.songQueue
    .getQueue()
    .map((v, i) => `${i + 1}. ${v.title}`)
    .join("\n");

  interaction.reply("Current queue:\n" + reply);
}

const queueCommand = new NicheBotCommand(data, execute);
export default queueCommand;
