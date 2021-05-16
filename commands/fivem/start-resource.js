const Commando = require("discord.js-commando");
const Rcon = require("rcon");
const { embedSettings, server, lang } = require("../../config.json");
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
      name: "start",
      group: "fivem",
      memberName: "start",
      description: i18n.__("start_command_description"),
      argsType: "single",
      userPermissions: ["ADMINISTRATOR"],
      examples: [".start esx_ambulancejob"],
    });
  }

  async run(message, args) {
    if (message.author.bot) return;
    cl.connect();
    cl.send(`start ${args}`);
    cl.on("response", function (str) {
      if (str == `rint ^3Couldn't find resource`) {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("resource_not_found"));
        message.embed(noArguments);
        return;
      } else if (str ==`rint Argument count mismatch`) {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(
            i18n.__("no_resource_provided", {
              action: i18n.__("action_start"),
            })
          );
        message.embed(noArguments);
        return;
      } else {
        const string = str
          .replace("rint", "")
          .replace("^3", "")
          .replace("^7", "");
        const serverOutput = new MessageEmbed()
          .setTitle(i18n.__("resource_started"))
          .setDescription(string)
          .setColor("#39435b")
          .setFooter(embedSettings.footer, embedSettings.icon)
          .setTimestamp();
        message.embed(serverOutput);
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
