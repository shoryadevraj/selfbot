import { saveDatabase } from '../../functions/database.js';

export default {
  name: "settextlock",
  aliases: ["textlock"],
  category: "utility",
  description: "Lock bot to specific text channel (Owner only)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 1) {
      const response = '```js\n' +
        'Usage\n\n' +
        ' settextlock <channel_id or none>\n' +
        '\nExample:\n' +
        ' settextlock 123456789012345678\n' +
        ' settextlock none\n' +
        '\n╰──────────────────────────────────╯\n```';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const input = args[0].toLowerCase();
    const channelId = input === "none" ? null : args[0].replace(/[^0-9]/g, '');

    if (channelId && channelId.length < 17) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    client.db.config.lockTextChannel = channelId;
    saveDatabase(client.db);

    const response = '```js\n' +
      'Text Channel Lock Updated\n\n' +
      ` Status: ${channelId ? "Locked" : "Unlocked"}\n` +
      ` Channel: ${channelId || "Any"}\n` +
      '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);
    await message.react("✅").catch(() => {});

    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
