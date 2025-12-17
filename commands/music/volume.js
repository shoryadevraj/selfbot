export default {
  name: 'volume',
  aliases: ['vol', 'v'],
  category: 'music',
  description: 'Set volume (0-200)',
  usage: 'volume <0-200>',

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    if (args.length === 0) {
      // Show current volume if no argument
      const vol = queue.volume;
      const volumeBar = '█'.repeat(Math.floor(vol / 10)) + '░'.repeat(20 - Math.floor(vol / 10));

      let response = '```js\n';
      response += 'Current Volume\n\n';
      response += ` ${vol}%\n`;
      response += ` [${volumeBar}]\n`;
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    const vol = parseInt(args[0]);
    if (isNaN(vol) || vol < 0 || vol > 200) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    queue.volume = vol;

    try {
      await client.lavalink.updatePlayerProperties(message.guild.id, { volume: vol });

      const volumeBar = '█'.repeat(Math.floor(vol / 10)) + '░'.repeat(20 - Math.floor(vol / 10));

      let response = '```js\n';
      response += 'Volume Updated\n\n';
      response += ` ${vol}%\n`;
      response += ` [${volumeBar}]\n`;
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);

      // Auto-delete response
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

      // React for quick feedback
      await message.react("🔊").catch(() => {});

      // Delete command message
      if (message.deletable) message.delete().catch(() => {});

    } catch (err) {
      console.error('[Volume Error]:', err);
      await message.react("❌").catch(() => {});
    }
  }
};
