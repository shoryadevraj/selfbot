export default {
    name: "skip",
    aliases: ["s"],
    category: "music",

    async execute(message, args, client) {
        const queue = client.queueManager.get(message.guild.id);
        if (!queue?.nowPlaying) {
            return message.channel.send("Nothing is playing");
        }

        // Clear current timeout and play next
        if (client.trackTimeouts.has(message.guild.id)) {
            clearTimeout(client.trackTimeouts.get(message.guild.id));
        }

        await client.playNext(message.guild.id);

        const response = '  ⏭ Skipped current song\n';

        const msg = await message.channel.send(response);

        // Auto-delete response after configured time
        setTimeout(() => {
            msg.delete().catch(() => {});
        }, client.db.config.autoDeleteTime || 30000);
    }
};
