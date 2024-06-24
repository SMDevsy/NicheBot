import { SlashCommandBuilder } from "discord.js";
import NicheBotCommand from "../NicheBotCommand";
import NicheBot from "../NicheBot";
import joinCommand from "./join";
import VideoData from "./VideoData";
import { resolveQuery } from "./resolveQuery";
import Fetcher from "./Fetcher";
import { createAudioResource } from "@discordjs/voice";

const data = new SlashCommandBuilder()
    .setName("playnow")
    .setDescription("Play a song immediately")
    .addStringOption(option =>
        option
            .setName("query")
            .setDescription("The song to play")
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option
            .setName("skip")
            .setDescription("Skip the current song")
            .setRequired(false)
    );

async function execute(interaction) {
    const query = interaction.options.getString("query", true);
    const skip = interaction.options.getBoolean("skip") ?? false;
    await interaction.reply(`Working...`);
    if(!NicheBot.voiceConnection) {
        joinCommand.execute(interaction);
    }
    let videos: (VideoData | null)[] = [];
    try {
        videos = await resolveQuery(query);
    } catch (e) {
        await interaction.editReply(
        "An error occured while processing the query: " + e
        );
        return;
    }

    const filtered = videos.filter(v => v !== null) as VideoData[];
    if (filtered.length === 0) {
        await interaction.editReply(
        "No valid videos found! This may be due to age restrictions or internal errors."
        );
        return;
    }
    let queue = NicheBot.songQueue;
    queue.addSongsAt(filtered, 1);
    await interaction.editReply("Added song to the queue!");
    if (skip) {
        queue.skipSongs(1);
        const audioPath = await Fetcher.fetchAudio(queue.currentSong()!);
        const resource = createAudioResource(audioPath);

        NicheBot.voiceConnection!.subscribe(NicheBot.audioPlayer._getPlayer());
        NicheBot.audioPlayer.play(resource);

        await interaction.editReply(`Playing now: ${queue.currentSong()!.title}`);
    }
}

const playNowCommand = new NicheBotCommand(data, execute);
export default playNowCommand;
