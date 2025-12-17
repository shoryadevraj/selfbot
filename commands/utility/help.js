export default {
  name: "help",
  aliases: ["h", "commands"],
  category: "utility",
  description: "Show all commands and categories",
  usage: "help [category]",

  async execute(message, args, client) {
    const prefix = process.env.PREFIX || "!";
    const categoryArg = args[0]?.toLowerCase();

    const commands = Array.from(client.commands.values());
    const categories = new Map();

    // Group commands by category
    for (const cmd of commands) {
      const cat = cmd.category ? cmd.category.toLowerCase() : "other";
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat).push(cmd);
    }

    let response = '```js\n';

    // Specific category
    if (categoryArg) {
      const cat = [...categories.keys()].find(c => c === categoryArg);
      if (!cat) {
        response += 'Category Not Found\n\n';
        response += ` "${categoryArg}" does not exist\n`;
      } else {
        const cmds = categories.get(cat);
        response += `${cat.toUpperCase()} COMMANDS\n\n`;
        cmds.forEach((cmd, i) => {
          response += `${i + 1}. ${cmd.name}`;
          if (cmd.aliases?.length) {
            response += ` (${cmd.aliases.join(", ")})`;
          }
          response += `\n   ${cmd.description || "No description"}\n`;
          if (cmd.usage) {
            response += `   Usage: ${prefix}${cmd.usage}\n`;
          }
          response += `\n`;
        });
      }
    } else {
      // Main menu
      response += 'S SELFBOT — COMMANDS\n\n';
      const sorted = [...categories.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      sorted.forEach(([cat, cmds], i) => {
        const name = cat.charAt(0).toUpperCase() + cat.slice(1);
        response += `${i + 1}. ${name} (${cmds.length} command${cmds.length === 1 ? '' : 's'})\n`;
      });
      response += `\nUsage: ${prefix}help <category>\n`;
      response += `Example: ${prefix}help music\n\n`;
      response += 'Created by Shorya Devraj\n';
    }

    response += '╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);

    // Auto-delete response
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

    // Delete command message
    if (message.deletable) message.delete().catch(() => {});
  }
};
