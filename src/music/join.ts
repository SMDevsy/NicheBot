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
  .setName("join")
  .setDescription("Joins the voice channel");

async function execute(interaction: ChatInputCommandInteraction) {
  if (BOT_STATE.voiceConnection) {
    await interaction.reply("I'm already in a voice channel!");
    return;
  }

  console.log("Joining voice channel...");
  const member = interaction.member as GuildMember;
  const channel = member.voice.channel as VoiceChannel | null;

  if (!channel) {
    await interaction.reply("You need to join a voice channel first!");
    return;
  }

  let voiceConnection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  voiceConnection.on(VoiceConnectionStatus.Ready, () => {
    console.log("Successfully joined voice channel.");
    BOT_STATE.voiceConnection = voiceConnection;
  });
  voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
    console.log("Disconnected from voice channel.");
    BOT_STATE.voiceConnection = null;
  });

  // commented out to prevent replying to the same interaction twice
  // this log is not needed anyway
  //await interaction.reply("Joined voice channel!");
}

const joinCommand = new NicheBotCommand(data, execute);
export default joinCommand;
