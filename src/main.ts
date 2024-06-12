import { BOT_CONFIG, Bot, init } from "./init";

function main() {
  console.info("Starting NicheBot...");
  console.log(BOT_CONFIG);
  init()
    .then(() => {
      console.log("Successfully initialized NicheBot.");
      Bot.login(BOT_CONFIG.token);
    })
    .catch(err => {
      console.error("An error occurred while starting NicheBot.");
      console.error(err);
    });
}

main();
