import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setlavalink",
  aliases: ["lavalink"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 3) return message.channel.send("```Usage: setlavalink <rest> <ws> <password>```");

    client.db.config.lavalinkRest = args[0];
    client.db.config.lavalinkWs = args[1];
    client.db.config.lavalinkPassword = args[2];
    saveDatabase(client.db);

    // Reload Lavalink with new config
    client.reloadLavalink();

    message.channel.send("```js\nLavalink updated and reloaded\n```");
  }
};
