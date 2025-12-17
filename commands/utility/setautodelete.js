import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setautodelete",
  aliases: ["autodelete"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 1) return message.channel.send("```Usage: setautodelete <seconds>```");

    const time = parseInt(args[0]);
    if (isNaN(time) || time < 5) return message.channel.send("```Time must be at least 5 seconds```");

    client.db.config.autoDeleteTime = time * 1000;
    saveDatabase(client.db);

    message.channel.send("```js\nAuto-delete time set to " + args[0] + " seconds\n```");
  }
};
