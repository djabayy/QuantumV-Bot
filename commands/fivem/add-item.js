const Commando = require("discord.js-commando");
const { embedSettings, server, lang, database, deleteCommandUsage, prefix } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const mysql = require('mysql');

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
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
}

module.exports = class RestartResourceCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "additem",
      group: "fivem",
      memberName: "additem",
      description: i18n.__("additem_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".additem [Itemname] [Itemlabel] [Weight]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    	if (message.author.bot) return;
        if (args.length < 2) {
            message.reply(i18n.__('no_arguments_provided'))
            return
        }
        const query = "INSERT INTO items (name, label, weight) VALUES (?, ?, ?)";
        connection.query(query, [args[0], args[1], args[2]], function(err, results) {
            // If the query has an error we're returning the error;
            if(results.affectedRows > 0) {
                const q = "SELECT * FROM items where name = ?";
                connection.query(q, [args[0]], function(err, result) {
                    
                    const embed = new MessageEmbed()
                    .setColor('#39435b')
                    .setTitle(i18n.__('itemInserted'))
                    .addFields(
                        { name: i18n.__('item_name'), value: result[0].name, inline: true },
                        { name: i18n.__('item_label'), value: result[0].label, inline: true },
                        { name: i18n.__('weight'), value: result[0].weight, inline: true },
                    )
                    .setFooter(embedSettings.footer, embedSettings.icon)
                    .setTimestamp()

                    message.embed(embed)
                    return
                })
            }
        })
  }
};
