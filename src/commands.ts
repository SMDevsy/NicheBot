import NicheBotCommand from "./NicheBotCommand";
import joinCommand from "./music/join";
import leaveCommand from "./music/leave";
import playCommand from "./music/play";
import pingCommand from "./tests/ping";

export default [
  pingCommand,
  playCommand,
  joinCommand,
  leaveCommand
] as NicheBotCommand[];
