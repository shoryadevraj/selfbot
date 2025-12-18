import { saveDatabase } from '../../functions/database.js';

export default {
  name: "setforceprefix",
  aliases: ["forceprefix"],
  category: "utility",
  description: "Force prefix requirement (true/false)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 1 || !["true", "false"].includes(args[0].toLowerCase())) {
      const response = 'Usage\n\n' +
        ' setforceprefix <true/false>\n' +
        '\n true  = always require prefix\n' +
        ' false = allow no-prefix mode\n';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    const value = args[0].toLowerCase() === "true";
    client.db.config.forcePrefix = value;
    saveDatabase(client.db);

    const response = 'Force Prefix Updated\n\n' +
      ` Status: ${value ? "Enabled" : "Disabled"}\n` +
      ` Prefix required: ${value ? "Yes" : "No"}\n`;

    const msg = await message.channel.send(response);
    await message.react("✅").catch(() => {});

    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
