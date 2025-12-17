import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setautodelete",
  aliases: ["autodelete"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 1) {
      return message.channel.send("```Usage: setautodelete <seconds>```");
    }

    const time = parseInt(args[0]);
    if (isNaN(time) || time < 5) {
      return message.channel.send("```Minimum 5 seconds```");
    }

    client.db.config.autoDeleteTime = time * 1000;
    saveDatabase(client.db);

    const response = '```js\n' +
      '  Auto-delete time updated\n' +
      `  New time: ${time} seconds\n` +
      '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);
    
    // Auto-delete the response
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
  }
};
