import { exec } from 'child_process';

export default {
  name: "restart",
  aliases: ["reboot"],
  category: "utility",
  description: "Restart the bot (OWNER ONLY)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      return message.channel.send("```Only the owner can restart the bot```");
    }

    const response = '```js\n' +
      '  Restarting bot...\n' +
      '  Be back in a few seconds\n' +
      '\n╰──────────────────────────────────╯\n```';

    await message.channel.send(response);

    // Delay a bit so message sends
    setTimeout(() => {
      process.exit(0);  // PM2/systemd will auto-restart
    }, 2000);
  }
};
