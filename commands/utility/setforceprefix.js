export default {
  name: "setforceprefix",
  aliases: ["forceprefix"],
  category: "utility",

  async execute(message, args, client) {
    if (args.length !== 1 || !["true", "false"].includes(args[0].toLowerCase())) {
        return message.channel.send("```Usage: setforceprefix <true/false>```");
    }

    client.db.config.forcePrefix = args[0].toLowerCase() === "true";
    saveDatabase(client.db);

    message.channel.send("```js\nForce prefix set to " + args[0] + "\n```");
  }
};
