import { REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";

export const BOT_CONFIG = {
  token: process.env.TOKEN!!,
  server_id: process.env.SERVER_ID!!,
  client_id: process.env.CLIENT_ID!!
};

export const Bot = new Client({ intents: [GatewayIntentBits.Guilds] });

Bot.on("ready", () => {
  console.log(`Logged in as ${Bot.user!.tag}!`);
});

Bot.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = commands.find(c => c.data.name === interaction.commandName);
  if (command) {
    console.log(`Executing ${command.data.name}`);
    command.execute(interaction);
  }
});

import commands from "./commands";

export async function init() {
  const commandData = commands.map(command => command.data);
  const rest = new REST({ version: "10" }).setToken(BOT_CONFIG.token);

  console.log("Started refreshing application (/) commands.");
  await rest.put(Routes.applicationCommands(BOT_CONFIG.client_id), {
    body: commandData
  });
  console.log("Successfully reloaded application (/) commands.");
}