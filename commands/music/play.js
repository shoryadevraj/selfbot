
import { joinVoiceChannel } from "@discordjs/voice";

export default {
  name: "play",
  aliases: ["p"],
  category: "music",

  async execute(message, args, client) {
    if (!message.guild) return;
    const vc = message.member?.voice?.channel;
    if (!vc) return message.channel.send("Join a voice channel first");
    if (!args.length) return message.channel.send("Give me a song name or URL");

    const query = args.join(" ");

    try {
      joinVoiceChannel({
        channelId: vc.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: true,
      });

      await new Promise(r => setTimeout(r, 1500));

      const vs = client.voiceStates[message.guild.id];
      if (!vs?.sessionId) return message.channel.send("Voice not ready yet");

      const result = await client.lavalink.loadTracks(
        query.startsWith("http") ? query : `ytsearch:${query}`
      );

      if (result.loadType === "empty" || !result.data) {
        return message.channel.send("No results found");
      }

      let track;
      if (result.loadType === "track") {
        track = result.data;
      } else if (result.loadType === "playlist" || result.loadType === "search") {
        track = result.data[0];
      } else {
        return message.channel.send("Invalid result type");
      }

      if (!track.info) return message.channel.send("Invalid track");

      let queue = client.queueManager.get(message.guild.id);
      if (!queue) {
        queue = client.queueManager.create(message.guild.id);
        queue.textChannel = message.channel;
      }

      let response = 'New Song\n';

      if (queue.nowPlaying) {
        client.queueManager.addSong(message.guild.id, track);
        response += '  ➕ Added to Queue\n';
        response += `  Position: ${queue.songs.length}\n\n`;
        response += `  ${track.info.title}\n`;
      } else {
        await client.startTrack(message.guild.id, track);
        response += '  ▶ Now Playing\n\n';
        response += `  ${track.info.title}\n`;
        response += `  Duration: ${formatDuration(track.info.length)}\n`;
      }

      const msg = await message.channel.send(response);

      // Auto-delete response
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

      // Delete command message
      if (message.deletable) message.delete().catch(() => {});

      return msg;  // ← Important for main handler auto-delete

    } catch (error) {
      console.error("[PLAY ERROR]:", error.message);
      message.react("❌").catch(() => {});
    }
  }
};

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
