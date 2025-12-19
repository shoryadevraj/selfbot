import WebSocket from 'ws';
import fetch from 'node-fetch';

class Lavalink {
  constructor({ restHost, wsHost, password, clientName }) {
    this.restHost = restHost;
    this.wsHost = wsHost;
    this.password = password;
    this.clientName = clientName;
    this.sessionId = null;
    this.ws = null;
    this.userId = null;
    this.listeners = new Map();
  }

  async connect(userId) {
    this.userId = userId;
    if (this.ws) this.ws.close();

    // v4 websocket path
    this.ws = new WebSocket(`${this.wsHost}/v4/websocket`, {
      headers: {
        Authorization: this.password,
        'User-Id': userId,
        'Client-Name': this.clientName,
      },
    });

    this.ws.on('open', () => console.log('[Lavalink] Connected'));
    this.ws.on('close', (code) => console.log(`[Lavalink] Closed: ${code}`));
    this.ws.on('error', (error) => console.error('[Lavalink] Error:', error));
    this.ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        this.handlePayload(data);
      } catch (err) {
        console.error('[Lavalink] Parse error:', err);
      }
    });
  }

  handlePayload(payload) {
    switch (payload.op) {
      case 'ready':
        this.sessionId = payload.sessionId;
        console.log('[Lavalink] Session:', this.sessionId);
        this.emit('ready', payload);
        break;
      case 'playerUpdate':
        this.emit('playerUpdate', payload);
        break;
      case 'event':
        this.emit('event', payload);
        break;
      case 'stats':
        this.emit('stats', payload);
        break;
    }
  }

  on(event, listener) {
    this.listeners.set(event, listener);
  }

  emit(event, data) {
    const listener = this.listeners.get(event);
    if (listener) listener(data);
  }

  // v4 loadtracks path
  async loadTracks(identifier) {
    const url = `${this.restHost}/v4/loadtracks?identifier=${encodeURIComponent(identifier)}`;
    const res = await fetch(url, { headers: { Authorization: this.password } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  // v4 player update
  async updatePlayer(guildId, track, voiceState, options = {}) {
    if (!this.sessionId) throw new Error('Session ID not set');
    const url = `${this.restHost}/v4/sessions/${this.sessionId}/players/${guildId}`;

    const payload = { voice: voiceState };

    if (track) {
      payload.track = { encoded: track.encoded };
    }

    if (options.volume !== undefined) payload.volume = options.volume;
    if (options.paused !== undefined) payload.paused = options.paused;
    if (options.filters !== undefined) payload.filters = options.filters;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { Authorization: this.password, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async updatePlayerProperties(guildId, properties = {}) {
    if (!this.sessionId) throw new Error('Session ID not set');
    const url = `${this.restHost}/v4/sessions/${this.sessionId}/players/${guildId}`;

    const payload = {};

    if (properties.volume !== undefined) payload.volume = properties.volume;
    if (properties.paused !== undefined) payload.paused = properties.paused;
    if (properties.filters !== undefined) payload.filters = properties.filters;
    if (properties.position !== undefined) payload.position = properties.position;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { Authorization: this.password, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async destroyPlayer(guildId) {
    if (!this.sessionId) throw new Error('Session ID not set');
    const url = `${this.restHost}/v4/sessions/${this.sessionId}/players/${guildId}`;
    const res = await fetch(url, { method: 'DELETE', headers: { Authorization: this.password } });
    return res.status === 204;
  }
}

export default Lavalink;
