import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel
} from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";
import NicheBot from "../NicheBot";
import { log } from "../log";

const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leaves the voice channel");

async function execute(interaction: ChatInputCommandInteraction) {
  if (!NicheBot.voiceConnection) {
    await interaction.reply("I'm not in a voice channel!");
    return;
  }

  log.warn("Leaving voice channel...");
  NicheBot.disconnect();

  await interaction.reply("Left the voice channel!");
}

const leaveCommand = new NicheBotCommand(data, execute);
export default leaveCommand;
