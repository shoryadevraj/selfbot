# Music Selfbot — Private Discord Music Bot (December 2025)

**The ultimate private Discord music selfbot — fully configurable, auto-queue, local Lavalink support, clean chat, and 24/7 hosting on Oracle Cloud.**

Built with ❤️ by **Shorya Devraj**

**Support Server (for any queries, help, or updates):** 
https://discord.gg/dYQH4pSVX3

## Features of bot

- **Auto-queue** — songs play one after another forever
- **Pause / Resume / Skip / Stop / Volume**
- **Filters** (bassboost, nightcore, vaporwave, tremolo, vibrato, distortion, rotation, karaoke, lowpass, etc.)
- **Queue management** (`!queue`, `!nowplaying`)
- **Beautiful code block responses** with auto-delete
- **Reaction feedback** for quick actions (✅ ❌ 🔄 ⏸ ▶ ⏭ ⏹ etc.)
- **Full config via commands** (no restart needed):
  - `!setforceprefix true/false` — require prefix or allow no-prefix
  - `!settextlock <channel_id/none>` — lock commands to specific text channel
  - `!setvclock <channel_id/none>` — lock music commands to specific voice channel
  - `!setautodelete <seconds>` — auto-delete bot messages after X seconds
  - `!setlavalink <rest> <ws> <password>` — switch Lavalink node live
  - `!changetoken <new_token>` — change Discord token live (owner only)
  - `!gitpull` — pull latest code from GitHub live
  - `!restart` — restart bot
  - `!status` — show uptime, config, Lavalink status
  - `!adduser / !removeuser` — manage allowed users
- **Local Lavalink support** — zero latency, no public node limits
- **Owner-only protection** for sensitive commands
- **Clean chat** — command messages deleted, responses auto-deleted
- **Silent mode** — many actions use reactions only (no text spam)

## Requirements

- Discord user account (selfbot — use at your own risk)
- Node.js 20+
- Java 17+ (for local Lavalink)
- PM2 (process manager)

## Hosting (Recommended: Oracle Cloud Always Free Tier)

This bot is designed to run 24/7 on **Oracle Cloud Always Free** (up to 4 cores + 24 GB RAM total — free forever).

### Quick Setup on Oracle VM

1. Create free Oracle Cloud account → VM.Standard.E3.Flex (1 OCPU, 16 GB RAM)
2. SSH in as `opc`
3. Install Node 20:
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install -y nodejs
   
## Install PM2 and git:

sudo npm install -g pm2
sudo yum install -y git

**Clone your repo (HTTPS with token or SSH key)**

npm install

Create .env with TOKEN, OWNER_ID, etc.

- Start bot:
pm2 start index.js --name "selfbot"
pm2 save
pm2 startup  # run the command it shows

Optional: 
- Local Lavalink (best performance)
wget https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar
nano application.yml  # paste minimal config
pm2 start "java -jar Lavalink.jar" --name "lavalink"
pm2 save

Then in Discord:
!setlavalink http://localhost:2333 ws://localhost:2333 youshallnotpass

- Note : You can run this bot on public node as well (write node in .env or using commands)

  # Hosting Music Selfbot in GitHub Codespaces (Temporary Testing)

This guide shows how to quickly host and test your selfbot in **GitHub Codespaces** — a free cloud development environment (up to 60 hours/month on free plan). Perfect for testing new features, debugging, or short sessions without setting up a permanent server.

**Note**: Codespaces stops when inactive (few hours) and is not for 24/7 use. For permanent hosting, use Oracle Cloud.

## Requirements

- GitHub account
- Your selfbot code in a **private or public** GitHub repo
- Do **NOT** commit your `.env` file or token (we'll add secrets safely)

## Step-by-Step Hosting in Codespaces

### 1. Push your code to GitHub
- Make sure your repo has all files:
  - `index.js`
  - `commands/` folder
  - `functions/` folder
  - `package.json`
- **Never commit** `.env` or tokens!

### 2. Open Codespace
1. Go to your repo on GitHub
2. Click the green **Code** button
3. Go to **Codespaces** tab
4. Click **Create codespace on main**

→ Codespace boots in 1–2 minutes (VS Code in browser opens)

### 3. Install dependencies
In the terminal at the bottom:
```bash
npm install
TOKEN=your_token_here OWNER_ID=your_id_here PREFIX=! node index.js
