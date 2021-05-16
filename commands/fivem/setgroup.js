const Commando = require("discord.js-commando");
const Rcon = require("rcon");
const {
  embedSettings,
  server,
  lang,
  prefix,
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

module.exports = class SetGroupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "setgroup",
      group: "fivem",
      memberName: "setgroup",
      description: i18n.__("setgroup_command_description"),
      argsType: "multiple",
      userPermissions: ["ADMINISTRATOR"],
      examples: [".setgroup 1 admin"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (args.length < 2) {
      const noArguments = new MessageEmbed().setColor("#39435b").setDescription(
        i18n.__("no_arguments_provided", {
          command: `${prefix}setgroup [ID] [${i18n.__("servergroup")}]`,
        })
      );
      message.embed(noArguments);
      return;
    }

    cl.connect();
    cl.send(`setgroup ${args[0]} ${args[1]}`);
    cl.on("response", function (str) {
      console.log(str);
      if (str === "rint") {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("usergroup_seet"));
        message.embed(noArguments);
        return;
      } else {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("no_user_online_with_that_id"));
        message.embed(noArguments);
        return;
      }
    });
  }
};
