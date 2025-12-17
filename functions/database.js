import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'database');
const CONFIG_PATH = path.join(DB_PATH, 'config.json');
const USERS_PATH = path.join(DB_PATH, 'users.json');

// Ensure "/database" exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
}

// DEFAULT FILE TEMPLATES
const DEFAULT_CONFIG = {
    noPrefixMode: false,
    rateLimits: {
        maxCommands: 5,
        timeWindow: 10000
    },
    allowedUsers: [],
    autoDeleteTime: 30000, // ms
    forcePrefix: false,
    lockTextChannel: null,
    lockVcChannel: null,
    lavalinkRest: process.env.LAVALINK_REST || "http://localhost:2333",
    lavalinkWs: process.env.LAVALINK_WS || "ws://localhost:2333",
    lavalinkPassword: process.env.LAVALINK_PASSWORD || "youshallnotpass"
};

const DEFAULT_USERS = {
    users: []
};

// Load DB
function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function loadUsers() {
    if (!fs.existsSync(USERS_PATH)) {
        fs.writeFileSync(USERS_PATH, JSON.stringify(DEFAULT_USERS, null, 2));
    }
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
}

// PUBLIC FUNCTIONS
export function loadDatabase() {
    const config = loadConfig();
    const users = loadUsers();
    return {
        config,
        users,
        noPrefixMode: config.noPrefixMode
    };
}

export function saveDatabase(db) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(db.config, null, 2));
    if (db.users) {
        fs.writeFileSync(USERS_PATH, JSON.stringify(db.users, null, 2));
    }
}
