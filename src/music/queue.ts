import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBot from "../NicheBot";
import NicheBotCommand from "../NicheBotCommand";

const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show the current queue");

async function execute(interaction: ChatInputCommandInteraction) {
  if (!NicheBot.voiceConnection) {
    await interaction.reply("I'm not in a voice channel!");
    return;
  }

  if (NicheBot.songQueue.isEmpty()) {
    await interaction.reply("The queue is empty!");
    return;
  }

  console.log("Showing queue...");
  console.log(NicheBot.songQueue.getQueue());

  const reply = NicheBot.songQueue
    .getQueue()
    .map((v, i) => `${i + 1}. ${v.title}`)
    .join("\n");

  interaction.reply("Current queue:\n" + reply);
}

const queueCommand = new NicheBotCommand(data, execute);
export default queueCommand;
