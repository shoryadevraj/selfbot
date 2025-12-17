import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setvclock",
  aliases: ["vclock"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 1) return message.channel.send("```Usage: setvclock <channel_id or none>```");

    const id = args[0].toLowerCase() === "none" ? null : args[0];

    client.db.config.lockVcChannel = id ? id : null;
    saveDatabase(client.db);

    message.channel.send("```js\nVoice channel lock set to " + (id ? id : "none") + "\n```");
  }
};
