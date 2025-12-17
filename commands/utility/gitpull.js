import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

export default {
  name: "gitpull",
  aliases: ["update", "pull"],
  category: "utility",
  description: "Pull latest code from GitHub (OWNER ONLY - NO RESTART)",

  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) {
      return message.channel.send("```Only the owner can update code```");
    }

    const response = '```js\n' +
      '  Pulling latest code from GitHub...\n' +
      '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);

    try {
      const { stdout, stderr } = await execPromise('git pull');

      let output = '```js\n';
      output += 'Git Pull Result\n\n';
      if (stdout.includes("Already up to date")) {
        output += '  Already up to date!\n';
      } else {
        output += '  Updated successfully!\n';
        output += `  ${stdout.trim()}\n`;
      }
      if (stderr) output += `\nWarning: ${stderr.trim()}\n`;
      output += '\nNew features loaded (no restart needed)\n';
      output += '╰──────────────────────────────────╯\n```';

      await msg.edit(output);

    } catch (error) {
      await msg.edit('```js\nGit pull failed\n' + error.message + '\n```');
    }

    // Auto-delete
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
  }
};
