import NicheBotCommand from "./NicheBotCommand";
import joinCommand from "./music/join";
import leaveCommand from "./music/leave";
import playCommand from "./music/play";
import queueCommand from "./music/queue";
import skipCommand from "./music/skip";
import pingCommand from "./tests/ping";

export default [
  pingCommand,
  playCommand,
  joinCommand,
  leaveCommand,
  queueCommand,
  skipCommand
] as NicheBotCommand[];
