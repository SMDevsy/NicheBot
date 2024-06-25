import { ChatInputCommandInteraction, REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import YTDlpWrap from "yt-dlp-wrap";

export const BOT_CONFIG = {
  token: process.env.TOKEN!!,
  server_id: process.env.SERVER_ID!!,
  client_id: process.env.CLIENT_ID!!
};

export const Bot = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

let shuttingDown = false;
process.on("SIGINT", async () => {
  if (shuttingDown) return;
  shuttingDown = true;

  log.warn("Shutting down...");
  
  NicheBot.disconnect();
  await Bot.destroy();

  process.exit(0);
});

Bot.on("ready", async () => {
  log.info(`Logged in as ${Bot.user!.tag}!`);
  const guild = Bot.guilds.cache.get(BOT_CONFIG.server_id);
  const res = await guild?.members.fetch();

  // guild?.members.cache.forEach(member => {
  //   if (member.user.bot) console.log(`Found bot: ${member.user.username}`);
  //   else console.log(`Found user: ${member.user.username}, ${member.user.id}, ${member.user.displayAvatarURL()}`);
  // });

  // guild?.channels.cache.forEach(channel => {
  //   console.log(`Found channel: ${channel.name}, ${channel.id}, ${channel.type}`);
  // });
});

Bot.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) {
    return;
  }
  if (!(interaction instanceof ChatInputCommandInteraction)) {
    return;
  }

  const command = commands.find(c => c.data.name === interaction.commandName);
  if (command) {
    log.info(`Executing ${command.data.name}`);
    command.execute(interaction);
  }
});

Bot.on("messageCreate", async message => {
  if (message.author.bot) return;
  const author = message.author.username;
  const channel = message.channelId;
  log.info(`${author} sent a message in ${channel}`)
  // when database will be implemented, author and channel will be used to store message count
});

Bot.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.member?.user.bot) return;
  else if (oldState.channelId === null) {
    log.info(`${oldState.member?.user.username} joined ${newState.channel?.name}`);
  }
  else if (newState.channelId === null) {
    log.info(`${oldState.member?.user.username} left ${oldState.channel?.name}`);
  }
  else {
    log.info(`${oldState.member?.user.username} moved from ${oldState.channel?.name} to ${newState.channel?.name}`);
  }
});

import commands from "./commands";
import NicheBot from "./NicheBot";
import { log } from "./log";

export async function init() {
  log.info("Downloading yt-dlp.");
  const downloadYTDlp = await YTDlpWrap.downloadFromGithub();
  log.info("Downloaded yt-dlp.");

  const commandData = commands.map(command => command.data);
  const rest = new REST({ version: "10" }).setToken(BOT_CONFIG.token);

  const postCommands = rest.put(
    Routes.applicationCommands(BOT_CONFIG.client_id),
    {
      body: commandData
    }
  );

  log.info("Refreshing application (/) commands.");
  await Promise.all([postCommands, downloadYTDlp]);
  log.info("Refreshed application (/) commands.");
}
