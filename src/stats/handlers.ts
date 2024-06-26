import { VoiceState } from "discord.js";
import { log } from "../log";

export async function handleVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState,
) {
  if (oldState.member?.user.bot) return;

  const member = oldState.member?.user.username;

  // THIS IS HORRIBLE. FIX LATER.
  if (!oldState.channelId) {
    log.info(`${member} joined ${newState.channel?.name}`);
  } else if (newState.channelId === null) {
    log.info(`${member} left ${oldState.channel?.name}`);
  } else if (newState.streaming && !oldState.streaming) {
    log.info(`${member} started streaming in ${newState.channel?.name}`);
  } else if (!newState.streaming && oldState.streaming) {
    log.info(`${member} stopped streaming in ${oldState.channel?.name}`);
  } else if (oldState.selfMute && !newState.selfMute) {
    log.info(`${member} unmuted in ${newState.channel?.name}`);
  } else if (!oldState.selfMute && newState.selfMute) {
    log.info(`${member} muted in ${newState.channel?.name}`);
  } else if (oldState.selfDeaf && !newState.selfDeaf) {
    log.info(`${member} undeafened in ${newState.channel?.name}`);
  } else if (!oldState.selfDeaf && newState.selfDeaf) {
    log.info(`${member} deafened in ${newState.channel?.name}`);
  } else {
    log.info(
      `${member} moved from ${oldState.channel?.name} to ${newState.channel?.name}`,
    );
  }
}

export async function handleMessageCreate(message) {
  if (message.author.bot) return;
  const author = message.author.username;
  const channel = message.channelId;
  log.info(`${author} sent a message in ${channel}`);
  // when database will be implemented, author and channel will be used to store message count
}
