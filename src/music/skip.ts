import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import { createAudioResource } from "@discordjs/voice";
import Fetcher from "./Fetcher";
import { log } from "../log";

const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current song")
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The number of songs to skip")
      .setRequired(false)
      .setMinValue(1),
  );

async function execute(interaction: ChatInputCommandInteraction) {
  log.info("Skipping song...");
  const amount = interaction.options.getInteger("amount") || 1;
  const queue = NicheBot.songQueue;
  const nextSong = queue.skipSongs(amount);

  if (!nextSong) {
    if (!interaction.replied) {
      await interaction.reply("Queue finished!");
    } else {
      await interaction.editReply("Queue finished!");
    }

    NicheBot.audioPlayer._getPlayer().stop();
    return;
  }

  await interaction.reply("Working...");

  let fetchedAudio;
  try {
    fetchedAudio = await Fetcher.fetchAudio(nextSong);
  } catch (error) {
    const s = `Error while downloading the audio: ${(error as Error).message}`;
    log.error(s);
    await interaction.editReply(s);
    skipCommand.execute(interaction);
    return;
  }
  const resource = createAudioResource(fetchedAudio);
  NicheBot.audioPlayer.play(resource);

  await interaction.editReply(`Skipped ${amount} songs!`);
}

const skipCommand = new NicheBotCommand(data, execute);
export default skipCommand;
