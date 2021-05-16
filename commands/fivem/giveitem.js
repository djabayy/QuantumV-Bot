const Commando = require("discord.js-commando");
const Rcon = require("rcon");
const {
  embedSettings,
  server,
  lang,
  deleteCommandUsage,
} = require("../../config.json");
const { MessageEmbed } = require("discord.js");
var options = {
  tcp: false, // false for UDP, true for TCP (default true)
  challenge: false, // true to use the challenge protocol (default true)
};
const cl = new Rcon(server.host, server.port, server.password, options);

var config = {
  lang: lang,
  langFile: "./../../locales/locales.json",
};

var i18n_module = require("i18n-nodejs");
var i18n = new i18n_module(config.lang, config.langFile);

module.exports = class StartResourceCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "giveitem",
      group: "fivem",
      memberName: "giveitem",
      description: i18n.__("giveitem_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".giveitem [ID] [ITEM] [COUNT]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (message.author.bot) return;

    if (args.length < 3) {
      const noArguments = new MessageEmbed()
        .setColor("#39435b")
        .setDescription(i18n.__("invalid_syntax_giveitem"));
      message.embed(noArguments);
      return;
    }

    cl.connect();
    cl.send(`giveitem ${args[0]} ${args[1]} ${args[2]}`);
    cl.on("response", function (str) {
      if (
        str ==
        "rint [es_extended] [^3WARNING^7] There is no player online matching that server id^7"
      ) {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("id_not_matching"));
        message.embed(noArguments);
        return;
      } else if (str == "rint") {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription("gave_item", {
            id: args[0],
            count: args[2],
            item: args[1],
          });
        message.embed(noArguments);
        return;
      }
    });

    cl.on("auth", function () {
      console.log("Authed!");
    })
      .on("response", function (str) {
        console.log("Got response: " + str);
      })
      .on("end", function () {
        console.log("Socket closed!");
      });
  }
};
