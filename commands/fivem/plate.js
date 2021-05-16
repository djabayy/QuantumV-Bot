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
      name: "plate",
      group: "fivem",
      memberName: "plate",
      description: i18n.__("plate_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".plate [PLATE]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (message.author.bot) return;

    if (args.length < 1) {
      const noArguments = new MessageEmbed()
        .setColor("#39435b")
        .setDescription(i18n.__("no_arguments_provided"));
      message.embed(noArguments);
      return;
    }

    const query = "SELECT * FROM owned_vehicles WHERE plate = ?";
    connection.query(query, [args[0]], function (err, result) {
      if (err) return console.log(err);
      if (result.length !== 0) {
        const foundPlateEmbed = new MessageEmbed()
          .setColor("#39435b")
          .setTitle(i18n.__("plateFoundTitle"))
          .setDescription(i18n.__("plateFound"))
          .addFields(
            {
              name: i18n.__("plate"),
              value: result[0].plate,
              inline: true,
            },
            {
              name: i18n.__("garage_type"),
              value: i18n.__(`${result[0].garage_type}`),
              inline: true,
            },
            {
              name: i18n.__("garage_id"),
              value: result[0].garage_id,
              inline: true,
            },
            {
              name: i18n.__("in_garage"),
              value: result[0].in_garage == 1 ? i18n.__("yes") : i18n.__("no"),
            }
          )
          .setFooter(embedSettings.footer, embedSettings.icon)
          .setTimestamp();
        message.embed(foundPlateEmbed);
        return;
      } else {
        const noArguments = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("plate_not_found"));
        message.embed(noArguments);
        return;
      }
    });
  }
};
