export default {
  name: "settextlock",
  aliases: ["textlock"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 1) return message.channel.send("```Usage: settextlock <channel_id or none>```");

    const id = args[0].toLowerCase() === "none" ? null : args[0];

    client.db.config.lockTextChannel = id ? id : null;
    saveDatabase(client.db);

    message.channel.send("```js\nText channel lock set to " + (id ? id : "none") + "\n```");
  }
};
