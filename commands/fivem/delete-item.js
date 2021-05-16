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
      name: "removeitem",
      group: "fivem",
      memberName: "removeitem",
      description: i18n.__("additem_command_description"),
      argsType: "single",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".removeitem [Itemname]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (message.author.bot) return;
    if (args.length < 2) {
      const noArguments = new MessageEmbed()
        .setColor("#39435b")
        .setDescription(i18n.__("no_arguments_provided"));
      message.embed(noArguments);
      return;
    }
    const query = "DELETE FROM items WHERE name = ?";
    connection.query(query, [args], function (err, results) {
      // If the query has an error we're returning the error;
      if (results.affectedRows > 0) {
        const embed = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("item_removed"));

        message.embed(embed);
        return;
      }
    });
  }
};
