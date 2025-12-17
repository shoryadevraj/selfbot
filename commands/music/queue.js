export default {
  name: "queue",
  aliases: ["q"],
  category: "music",
  description: "Show current music queue",

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);

    // Nothing playing at all
    if (!queue || (!queue.nowPlaying && queue.songs.length === 0)) {
      await message.react("📭").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    let response = '```js\n';
    response += 'Music Queue\n\n';

    // Now Playing
    if (queue.nowPlaying) {
      response += 'Now Playing\n';
      response += ` ${queue.nowPlaying.info.title}\n`;
      response += ` by ${queue.nowPlaying.info.author}\n\n`;
    }

    // Up Next
    if (queue.songs.length === 0) {
      response += 'No songs in queue\n';
    } else {
      response += `Up Next (${queue.songs.length} song${queue.songs.length === 1 ? '' : 's'})\n\n`;
      queue.songs.slice(0, 15).forEach((song, i) => {
        response += ` ${i + 1}. ${song.info.title}\n`;
        response += ` by ${song.info.author}\n\n`;
      });
      if (queue.songs.length > 15) {
        response += ` ...and ${queue.songs.length - 15} more\n`;
      }
    }

    response += '╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);

    // Auto-delete response
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

    // Delete command message
    if (message.deletable) message.delete().catch(() => {});
  }
};
