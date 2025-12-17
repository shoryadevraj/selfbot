import { getVoiceConnection } from '@discordjs/voice';

export default {
  name: 'disconnect',
  aliases: ['dc', 'leave'],
  category: 'music',

  async execute(message, args, client) {
    const guildId = message.guild.id;

    try {
      await client.lavalink.destroyPlayer(guildId);
      client.queueManager.delete(guildId);

      const connection = getVoiceConnection(guildId);
      if (connection) connection.destroy();

      await message.react("👋");

      if (message.deletable) message.delete().catch(() => {});

    } catch (err) {
      console.error('[DC Error]:', err);
      message.react("❌").catch(() => {});
    }
  }
};
