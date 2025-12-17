export default {
  name: "nowplaying",
  aliases: ["np", "current"],
  category: "music",
  description: "Show the currently playing track",

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      return message.react("❌").catch(() => {});
    }

    const track = queue.nowPlaying;
    const duration = formatDuration(track.info.length);

    let response = '```js\n';
    response += 'Now Playing\n\n';
    response += ` ${track.info.title}\n`;
    response += `\n ${track.info.author}\n`;
    response += `\n Duration: ${duration}\n`;
    response += ` Volume: ${queue.volume}%\n`;
    response += ` Queue: ${queue.songs.length} song${queue.songs.length === 1 ? '' : 's'}\n`;
    response += ` Status: ${queue.paused ? "Paused" : "Playing"}\n`;  // ← Fixed position
    response += '\n╰──────────────────────────────────╯\n```';

    const msg = await message.channel.send(response);

    // Auto-delete response
    setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

    // Delete command message
    if (message.deletable) message.delete().catch(() => {});
  }
};

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
