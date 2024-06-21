import NicheBotCommand from "./NicheBotCommand";
import loopCommand from "./loop";
import joinCommand from "./music/join";
import leaveCommand from "./music/leave";
import pauseCommand from "./music/pause";
import playCommand from "./music/play";
import queueCommand from "./music/queue";
import resumeCommand from "./music/resume";
import shuffleCommand from "./music/shuffle";
import skipCommand from "./music/skip";
import pingCommand from "./tests/ping";

export default [
  pingCommand,
  playCommand,
  joinCommand,
  leaveCommand,
  queueCommand,
  skipCommand,
  loopCommand,
  pauseCommand,
  resumeCommand,
  shuffleCommand
] as NicheBotCommand[];
