import 'dotenv/config';
import { Client } from 'discord.js-selfbot-v13';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDatabase, saveDatabase } from './functions/database.js';
import Lavalink from './functions/lavalink.js';
import queueManager from './functions/queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ checkUpdate: false });

let lavalink = new Lavalink({
    restHost: process.env.LAVALINK_REST,
    wsHost: process.env.LAVALINK_WS,
    password: process.env.LAVALINK_PASSWORD,
    clientName: process.env.CLIENT_NAME || 'Selfbot',
});

// Collections
client.voiceStates = {};
client.commands = new Map();
client.aliases = new Map();
client.trackTimeouts = new Map();
client.lavalink = lavalink;
client.queueManager = queueManager;
client.db = loadDatabase();

// Load commands
const cmdPath = path.join(__dirname, 'commands');
for (const category of fs.readdirSync(cmdPath).filter(f => fs.statSync(path.join(cmdPath, f)).isDirectory())) {
    for (const file of fs.readdirSync(path.join(cmdPath, category)).filter(f => f.endsWith('.js'))) {
        const fullPath = path.join(cmdPath, category, file);
        const command = (await import(`file://${fullPath}`)).default;
        if (command?.name) {
            client.commands.set(command.name, command);
            command.aliases?.forEach(alias => client.aliases.set(alias, command.name));
            console.log(`Loaded: ${command.name} (${category})`);
        }
    }
}

// Voice state tracking
client.ws.on('VOICE_STATE_UPDATE', packet => {
    if (packet.user_id !== client.user.id) return;
    const gid = packet.guild_id;
    client.voiceStates[gid] ??= {};
    client.voiceStates[gid].sessionId = packet.session_id;
});

client.ws.on('VOICE_SERVER_UPDATE', packet => {
    const gid = packet.guild_id;
    client.voiceStates[gid] ??= {};
    client.voiceStates[gid].token = packet.token;
    client.voiceStates[gid].endpoint = packet.endpoint;
});

lavalink.on('ready', () => console.log('[Lavalink] Connected'));

// AUTO-QUEUE — 100% WORKING
client.startTrack = async (guildId, track) => {
    const queue = client.queueManager.get(guildId);
    if (!queue) return;

    queue.nowPlaying = track;

    if (client.trackTimeouts.has(guildId)) {
        clearTimeout(client.trackTimeouts.get(guildId));
    }

    try {
        const vs = client.voiceStates[guildId];
        await lavalink.updatePlayer(guildId, track, vs, {
            volume: queue.volume || 100,
            filters: queue.filters || {}
        });

        // Optional visual feedback (react)
        queue.textChannel?.react?.("▶").catch(() => {});

        const duration = track.info.length || 180000;
        const timeout = setTimeout(() => client.playNext(guildId), duration + 1000);
        client.trackTimeouts.set(guildId, timeout);

    } catch (e) {
        console.error("Failed to start track:", e.message);
    }
};

client.playNext = async (guildId) => {
    const queue = client.queueManager.get(guildId);
    if (!queue) return;

    const next = client.queueManager.getNext(guildId);
    if (!next) {
        queue.nowPlaying = null;
        queue.textChannel?.react?.("⏹").catch(() => {});
        return;
    }

    await client.startTrack(guildId, next);
};

// Reload Lavalink on config change
client.reloadLavalink = () => {
    lavalink = new Lavalink({
        restHost: client.db.config.lavalinkRest,
        wsHost: client.db.config.lavalinkWs,
        password: client.db.config.lavalinkPassword,
        clientName: process.env.CLIENT_NAME || 'Selfbot',
    });
    client.lavalink = lavalink;
    lavalink.connect(client.user.id);
    console.log('[Lavalink] Reloaded with new config');
};

// Ready
client.on('ready', () => {
    console.log(`\nLogged in as ${client.user.tag}`);
    console.log('Auto-queue: WORKING');
    lavalink.connect(client.user.id);
});

// COMMAND HANDLER
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const db = client.db;

    // OWNER + ALLOWED USERS CHECK
    const isOwner = message.author.id === process.env.OWNER_ID;
    const isAllowed = db.config.allowedUsers.includes(message.author.id);
    if (!isOwner && !isAllowed) return;

    const prefix = process.env.PREFIX || "!";

    // LOCK TO TEXT CHANNEL IF SET
    if (db.config.lockTextChannel && message.channel.id !== db.config.lockTextChannel) return;

    // FORCE PREFIX IF SET
    if (db.config.forcePrefix && !message.content.startsWith(prefix)) return;

    // PREFIX/NO-PREFIX LOGIC
    let args = [];
    if (db.config.forcePrefix || !db.noPrefixMode) {
        if (!message.content.startsWith(prefix)) return;
        args = message.content.slice(prefix.length).trim().split(/ +/);
    } else {
        args = message.content.trim().split(/ +/);
    }

    const cmdName = args.shift()?.toLowerCase();
    const command = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));
    if (!command) return;

    // LOCK TO VC FOR MUSIC IF SET
    if (command.category === "music" && db.config.lockVcChannel) {
        if (!message.member?.voice?.channel || message.member.voice.channel.id !== db.config.lockVcChannel) {
            return message.channel.send("```You must be in the locked voice channel for music commands```");
        }
    }

    try {
        if (message.deletable) await message.delete().catch(() => {});
        const reply = await command.execute(message, args, client);

        // AUTO DELETE BOT MESSAGE AFTER TIME
        if (reply?.id) {
            setTimeout(() => {
                reply.delete().catch(() => {});
            }, db.config.autoDeleteTime || 30000);
        }
    } catch (error) {
        console.error("Command error:", error.message);
    }
});

// Login
client.login(process.env.TOKEN).catch(err => {
    console.error("Login failed:", err.message);
    process.exit(1);
});
