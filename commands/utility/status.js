export default {
  name: "status",
  aliases: ["info", "botinfo"],
  category: "utility",
  description: "Show bot status and configuration",

  async execute(message, args, client) {
    const db = client.db.config;
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    let response = '```js\n';
    response += 'Bot Status\n\n';
    response += ` Uptime: ${hours}h ${minutes}m ${seconds}s\n`;
    response += ` Guilds: ${client.guilds.cache.size}\n`;
    response += ` Users: ${client.users.cache.size}\n\n`;

    response += 'Current Config\n';
    response += ` Force Prefix: ${db.forcePrefix ? "Yes" : "No"}\n`;
    response += ` Text Lock: ${db.lockTextChannel || "None"}\n`;
    response += ` VC Lock: ${db.lockVcChannel || "None"}\n`;
    response += ` Auto-Delete: ${db.autoDeleteTime / 1000}s\n`;
    response += ` Lavalink: ${db.lavalinkRest}\n\n`;

    response += 'Created by Quantheon Development\n';
    response += '╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);

    setTimeout(() => msg.delete().catch(() => {}), db.autoDeleteTime || 30000);
  }
};
