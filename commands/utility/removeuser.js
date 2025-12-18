import { saveDatabase } from '../../functions/database.js';

export default {
  name: "removeuser",
  aliases: ["unallow", "unwhitelist"],
  category: "utility",
  description: "Remove a user from the allowed list (Owner only)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 1) {
      const response = 'Usage\n\n' +
        ' removeuser <user_id>\n' +
        '\nExample: removeuser 123456789012345678\n';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const userId = args[0].replace(/[^0-9]/g, '');
    if (!userId || userId.length < 17) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const list = client.db.config.allowedUsers;
    if (!list.includes(userId)) {
      const response = 'User Not Found\n\n' +
        ` ID: ${userId}\n` +
        ' Not in allowed list\n';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    client.db.config.allowedUsers = list.filter(id => id !== userId);
    saveDatabase(client.db);

    const response = 'User Removed Successfully\n\n' +
      ` ID: ${userId}\n` +
      ` Remaining: ${client.db.config.allowedUsers.length}\n`;

    const msg = await message.channel.send(response);
    await message.react("✅").catch(() => {});

    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
