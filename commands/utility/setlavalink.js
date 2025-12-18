import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setlavalink",
  aliases: ["lavalink"],
  category: "utility",
  description: "Update Lavalink node details",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 3) {
      const response = 'Usage\n\n' +
        ' setlavalink <rest_url> <ws_url> <password>\n';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    client.db.config.lavalinkRest = args[0];
    client.db.config.lavalinkWs = args[1];
    client.db.config.lavalinkPassword = args[2];
    saveDatabase(client.db);

    // Reload Lavalink
    client.reloadLavalink();

    const response = 'Lavalink Updated\n\n' +
      ' New node connected\n' +
      ' Config saved\n';

    const msg = await message.channel.send(response);
    await message.react("✅").catch(() => {});

    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
