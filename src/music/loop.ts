import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import { LoopType } from "../music/SongQueue";

const data = new SlashCommandBuilder()
  .setName("loop")
  .setDescription("Loops the current queue or song")
  .addStringOption(option => option.addChoices(
    { name: "queue", value: "all" },
    { name: "song", value: "one" },
    { name: "disabled", value: "disabled" })
    .setName("looptype")
    .setDescription("The type of the loop")
    .setRequired(false));

function loopMessage(loopType: LoopType) {
  switch (loopType) {
    case "all":
      return "Looping the queue";
    case "one":
      return "Looping the current song";
    case "disabled":
      return "Looping disabled";
  }
}

async function execute(interaction) {
  const defaultLoopType = (NicheBot.songQueue.looping === "disabled") ?  "all" : "disabled";
  const loopType = interaction.options.getString("looptype") ?? defaultLoopType;
  NicheBot.songQueue.setLoopType(loopType);
  await interaction.reply(loopMessage(loopType));
}

const loopCommand = new NicheBotCommand(data, execute);
export default loopCommand;
