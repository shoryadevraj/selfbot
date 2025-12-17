
import fs from 'fs';
import path from 'path';

export default {
  name: "changetoken",
  aliases: ["newtoken", "updatetoken"],
  category: "utility",
  description: "Update the bot token (OWNER ONLY - DANGEROUS)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length !== 1) {
      const response = '```js\n' +
        'Usage\n\n' +
        ' changetoken <new_token>\n' +
        '\nWarning: Invalid token will disconnect bot temporarily\n' +
        '\n╰──────────────────────────────────╯\n```';
      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    const newToken = args[0].trim();

    if (!/^[A-Za-z0-9_\.\-]{50,100}$/.test(newToken)) {
      await message.react("❌").catch(() => {});
      return;
    }

    const response = '```js\n' +
      'Changing Token\n\n' +
      ' Logging out...\n' +
      ' Logging in with new token...\n' +
      '\n╰──────────────────────────────────╯\n```';

    const statusMsg = await message.channel.send(response);

    try {
      await client.destroy();

      // Update .env for persistence
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/^TOKEN=.*/m, `TOKEN=${newToken}`);
      fs.writeFileSync(envPath, envContent);

      await client.login(newToken);

      await statusMsg.edit('```js\n' +
        'Token Changed Successfully\n\n' +
        ' Bot reconnected\n' +
        ' You are now using the new account\n' +
        '\n╰──────────────────────────────────╯\n```');

      await message.react("✅").catch(() => {});

    } catch (error) {
      console.error("Token change failed:", error.message);
      await statusMsg.edit('```js\n' +
        'Token Change Failed\n\n' +
        ' Invalid or rate-limited token\n' +
        ' Staying on old token\n' +
        '\n╰──────────────────────────────────╯\n```');
      await message.react("❌").catch(() => {});
    }

    setTimeout(() => statusMsg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
    if (message.deletable) message.delete().catch(() => {});
  }
};
