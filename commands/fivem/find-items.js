const Commando = require("discord.js-commando");
const {
  embedSettings,
  server,
  lang,
  database,
  deleteCommandUsage,
  prefix,
} = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: database.host,
  user: database.user,
  port: database.port,
  database: database.database,
  password: database.password,
});

var config = {
  lang,
  langFile: "./../../locales/locales.json",
};

var i18n_module = require("i18n-nodejs");
var i18n = new i18n_module(config.lang, config.langFile);

function formatNumber(number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

module.exports = class RestartResourceCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "finditem",
      group: "fivem",
      memberName: "finditem",
      description: i18n.__("allitem_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (message.author.bot) return;
    const q = "SELECT * FROM items WHERE name = ?";
    connection.query(q, [args[0]], function (err, results) {
      if (results.length > 0) {
        const itemFound = new MessageEmbed()
          .setColor("#39435b")
          .setTitle(i18n.__("itemFound"))
          .addFields(
            {
              name: i18n.__("item_name"),
              value: results[0].name,
              inline: true,
            },
            {
              name: i18n.__("item_label"),
              value: results[0].label,
              inline: true,
            },
            {
              name: i18n.__("weight"),
              value: results[0].weight + "kg",
              inline: true,
            }
          )
          .setFooter(embedSettings.footer, embedSettings.icon)
          .setTimestamp();
        message.embed(itemFound);
        return;
      } else {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("itemNotFound"));
        message.embed(noArguments);
        return;
      }
    });
  }
};
