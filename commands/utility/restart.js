import { exec } from 'child_process';

export default {
  name: "restart",
  aliases: ["reboot"],
  category: "utility",
  description: "Restart the bot (OWNER ONLY)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const response = '```js\n' +
      '  Restarting Bot\n\n' +
      '  Logging out...\n' +
      '  Be back in a few seconds\n' +
      '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);
    await message.react("🔄").catch(() => {});

    // Auto-delete
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});

    // Actual restart
    setTimeout(() => {
      process.exit(0); // PM2/systemd will auto-restart
    }, 3000);
  }
};
