export default {
  name: "resume",
  aliases: ["re", "unpause"],
  category: "music",
  description: "Resume the paused song",

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      return message.channel.send("```Nothing is playing right now```");
    }

    try {
      // Resume using your Lavalink method
      await client.lavalink.updatePlayer(message.guild.id, queue.nowPlaying, client.voiceStates[message.guild.id], {
        paused: false  // ← This resumes the track
      });

      let response = '```js\n';
      response += '  ▶ Resumed\n';
      response += '  Playing again\n';
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);

      // Auto-delete after your configured time
      setTimeout(() => {
        msg.delete().catch(() => {});
      }, client.db.config.autoDeleteTime || 30000);

    } catch (error) {
      console.error("[Resume Error]:", error.message);
      message.channel.send("```Failed to resume```").catch(() => {});
    }
  }
};
