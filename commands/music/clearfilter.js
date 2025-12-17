export default {
  name: 'clearfilter',
  aliases: ['cf', 'clearfilters'],
  category: 'music',

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      return message.react("❌").catch(() => {});
    }

    queue.filters = {};

    try {
      await client.lavalink.updatePlayerProperties(message.guild.id, { filters: {} });
      await message.react("✅");

      // Auto-delete command message
      if (message.deletable) message.delete().catch(() => {});

    } catch (err) {
      console.error('[ClearFilter Error]:', err);
      message.react("❌").catch(() => {});
    }
  }
};
