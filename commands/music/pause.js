export default {
  name: "pause",
  aliases: ["pa"],
  category: "music",
  description: "Pause the current song",

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      return message.channel.send("Nothing is playing right now");
    }

    try {
      // Pause using your Lavalink method (most wrappers support this)
      await client.lavalink.updatePlayer(message.guild.id, queue.nowPlaying, client.voiceStates[message.guild.id], {
        paused: true  // ← This pauses the track
      });

      let response = '  ⏸ Paused\n';
      response += '  Current song paused\n';

      const msg = await message.channel.send(response);

      // Auto-delete after your configured time
      setTimeout(() => {
        msg.delete().catch(() => {});
      }, client.db.config.autoDeleteTime || 30000);

    } catch (error) {
      console.error("[Pause Error]:", error.message);
      message.channel.send("Failed to pause").catch(() => {});
    }
  }
};
