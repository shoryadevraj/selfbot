import { getVoiceConnection } from '@discordjs/voice';

export default {
  name: 'stop',
  aliases: ['st'],
  category: 'music',
  description: 'Stop music and clear the queue',

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue) {
      await message.react("❌").catch(() => {});
      if (message.deletable) message.delete().catch(() => {});
      return;
    }

    try {
      await client.lavalink.destroyPlayer(message.guild.id);
      client.queueManager.delete(message.guild.id);

      const connection = getVoiceConnection(message.guild.id);
      if (connection) connection.destroy();

      // Simple reaction + short message
      await message.react("⏹").catch(() => {});

      let response = '```js\n';
      response += '  ⏹ Stopped\n';
      response += '  🗑 Queue cleared\n';
      response += '  👋 Disconnected\n';
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);

      // Auto-delete response
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

      // Delete command message
      if (message.deletable) message.delete().catch(() => {});

    } catch (err) {
      console.error('[Stop Error]:', err);
      message.react("❌").catch(() => {});
    }
  }
};
