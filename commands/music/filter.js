import fetch from 'node-fetch';

const filters = {
  bassboost: { equalizer: [{ band: 0, gain: 0.20 }, { band: 1, gain: 0.15 }, { band: 2, gain: 0.10 }, { band: 3, gain: 0.05 }] },
  nightcore: { timescale: { speed: 1.25, pitch: 1.25, rate: 1.0 } },
  vaporwave: { timescale: { speed: 0.85, pitch: 0.90, rate: 1.0 } },
  tremolo: { tremolo: { frequency: 12, depth: 0.75 } },
  vibrato: { vibrato: { frequency: 14, depth: 0.75 } },
  distortion: { distortion: { sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1 } },
  rotation: { rotation: { rotationHz: 0.2 } },
  channelmix: { channelMix: { leftToLeft: 1, leftToRight: 0, rightToLeft: 0, rightToRight: 1 } },
  karaoke: { karaoke: { level: 1, monoLevel: 1, filterBand: 220, filterWidth: 100 } },
  lowpass: { lowPass: { smoothing: 20 } }
};

export default {
  name: 'filter',
  aliases: ['fx'],
  category: 'music',
  description: 'Apply audio filter to current track',
  usage: 'filter <filter_name>',

  async execute(message, args, client) {
    const queue = client.queueManager.get(message.guild.id);
    if (!queue?.nowPlaying) {
      return message.react("❌").catch(() => {});
    }

    const filterName = args[0]?.toLowerCase();

    // Show filter list
    if (!filterName || !filters[filterName]) {
      let response = '```js\n';
      response += 'Available Filters\n\n';
      Object.keys(filters).forEach((f, i) => {
        response += ` [${i + 1}] ${f}\n`;
      });
      response += '\n Usage: filter <name>\n';
      response += ' Clear: clearfilter\n';
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);
      return;
    }

    queue.filters = filters[filterName];

    try {
      const url = `${process.env.LAVALINK_REST}/v4/sessions/${client.lavalink.sessionId}/players/${message.guild.id}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: process.env.LAVALINK_PASSWORD,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters: queue.filters })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      let response = '```js\n';
      response += 'Filter Applied\n\n';
      response += ` Filter: ${filterName}\n`;
      response += ` Track: ${queue.nowPlaying.info.title}\n`;
      response += '\n╰──────────────────────────────────╯\n```';

      const msg = await message.channel.send(response);

      // Auto-delete response
      setTimeout(() => msg.delete().catch(() => {}), client.db.config.autoDeleteTime || 30000);

    } catch (err) {
      console.error('[Filter Error]:', err);
      message.react("❌").catch(() => {});
    }

    // Delete command message
    if (message.deletable) message.delete().catch(() => {});
  }
};
