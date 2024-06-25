import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import { createAudioResource } from "@discordjs/voice";
import Fetcher from "./Fetcher";

const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current song")
  .addIntegerOption(option =>
    option
      .setName("amount")
      .setDescription("The number of songs to skip")
      .setRequired(false)
      .setMinValue(1)
  );

async function execute(interaction: ChatInputCommandInteraction) {
  console.log("Skipping song...");
  const amount = interaction.options.getInteger("amount") || 1;
  const queue = NicheBot.songQueue;
  const nextSong = queue.skipSongs(amount);

  if (!nextSong) {
    await interaction.reply("Queue finished!");
    NicheBot.audioPlayer._getPlayer().stop();
    return;
  }

  await interaction.reply("Working...");

  const fetched = await Fetcher.fetchAudio(nextSong);
  const resource = createAudioResource(fetched);
  NicheBot.audioPlayer.play(resource);

  await interaction.editReply(`Skipped ${amount} songs!`);
}

const skipCommand = new NicheBotCommand(data, execute);
export default skipCommand;
