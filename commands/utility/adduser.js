import { saveDatabase } from '../../functions/database.js';

export default {
  name: "adduser",
  aliases: ["allow", "whitelist"],
  category: "utility",
  description: "Add a user to the allowed list (Owner only)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 1) {
      const response = '```js\n' +
        'Usage\n\n' +
        ' adduser <user_id>\n' +
        '\nExample: adduser 123456789012345678\n' +
        '\n╰──────────────────────────────────╯\n```';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const userId = args[0].replace(/[^0-9]/g, ''); // Clean ID
    if (!userId || userId.length < 17) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const list = client.db.config.allowedUsers;
    if (list.includes(userId)) {
      const response = '```js\n' +
        'User Already Allowed\n\n' +
        ` ID: ${userId}\n` +
        '\n╰──────────────────────────────────╯\n```';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    list.push(userId);
    saveDatabase(client.db);

    const response = '```js\n' +
      'User Added Successfully\n\n' +
      ` ID: ${userId}\n` +
      ` Total Allowed: ${list.length}\n` +
      '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);
    await message.react("✅").catch(() => {});

    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
