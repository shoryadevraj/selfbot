export default {
  name: "changetoken",
  aliases: ["newtoken", "updatetoken"],
  category: "utility",
  description: "Update the bot token (OWNER ONLY - USE WITH CAUTION)",

  async execute(message, args, client) {
    // ONLY the real owner (from .env) can use this
    if (message.author.id !== process.env.OWNER_ID) {
      return message.channel.send("```Only the bot owner can use this command```");
    }

    if (args.length !== 1) {
      return message.channel.send("```Usage: changetoken <new_discord_token>```");
    }

    const newToken = args[0].trim();

    // Basic validation (Discord tokens are ~59-80 chars, contain . and _)
    if (!/^[A-Za-z0-9_\.\-]{50,100}$/.test(newToken)) {
      return message.channel.send("```Invalid token format```");
    }

    try {
      // Log out current client
      await client.destroy();

      // Update .env file (optional - for persistence after restart)
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/^TOKEN=.*/m, `TOKEN=${newToken}`);
      fs.writeFileSync(envPath, envContent);

      // Login with new token
      await client.login(newToken);

      const response = '```js\n' +
        '  Token updated successfully\n' +
        '  Bot reconnected with new account\n' +
        '  Use carefully — never share tokens\n' +
        '\n╰──────────────────────────────────╯\n```';

      await message.channel.send(response);

    } catch (error) {
      console.error("Token change failed:", error.message);
      message.channel.send("```Failed to login with new token — invalid or rate-limited```");
    }
  }
};
