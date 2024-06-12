import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface NicheBotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};
