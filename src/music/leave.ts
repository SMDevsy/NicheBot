import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel
} from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import { VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";
import BOT_STATE from "../BotState";

const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leaves the voice channel");

async function execute(interaction: ChatInputCommandInteraction) {
  if (!BOT_STATE.voiceConnection) {
    await interaction.reply("I'm not in a voice channel!");
    return;
  }

  console.log("Leaving voice channel...");
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel as VoiceChannel | null;

  if (!channel) {
    await interaction.reply("You need to be in a channel to make me leave!");
    return;
  }

  BOT_STATE.voiceConnection.destroy();
  BOT_STATE.voiceConnection = null;
  BOT_STATE.songQueue.clear();

  await interaction.reply("Left the voice channel!");
}

const leaveCommand = new NicheBotCommand(data, execute);
export default leaveCommand;
