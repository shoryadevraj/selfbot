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

    await message.react("🔄").catch(() => {});

    // Delete command message for clean chat
    if (message.deletable) message.delete().catch(() => {});

    // Restart after short delay
    setTimeout(() => {
      process.exit(0); // PM2/systemd will auto-restart
    }, 2000);
  }
};
