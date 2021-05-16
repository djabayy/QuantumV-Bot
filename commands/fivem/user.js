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
      name: "user",
      group: "fivem",
      memberName: "user",
      description: i18n.__("user_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".user [NAME]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    	if (message.author.bot) return;
      console.log(args[0])
        if (args.length < 2) {
          console.log('no args', args)
            message.reply(i18n.__('no_arguments_provided'))
            return
        }
        const query = "SELECT * FROM users WHERE firstname = ?  AND lastname = ?;";
        connection.query(query, [args[0], args[1]], function(err, results) {
            // If the query has an error we're returning the error;
            if (err) return console.log(err);
            if (results.length !== 0) {
            connection.query("SELECT label FROM jobs WHERE name = ?;", [results[0].job], function(err, res) {
                const accounts = JSON.parse(results[0].accounts);
               const job = res[0].label
               const foundUserEmbed = new MessageEmbed()
                    .setColor('#39435b')
                    .setTitle(i18n.__('userFoundTitle'))
                    .setDescription(i18n.__('userFound'))
                    .addFields(
                        { name: i18n.__('firstname'), value: results[0].firstname, inline: true },
                        { name: i18n.__('lastname'), value: results[0].lastname, inline: true },
                        { name: i18n.__('sex'), value: i18n.__(results[0].sex), inline: true },
                        { name: i18n.__('job'), value: job ?? 'n/a', inline: true },
                        { name: i18n.__('job_grade'), value: results[0].job_grade, inline: true },
                        { name: i18n.__('servergroup'), value: i18n.__(results[0].group), inline: true },
                        { name: i18n.__('money'), value: `${formatNumber(accounts.money)}`, inline: true },
                        { name: i18n.__('bank'), value: `${formatNumber(accounts.bank)}`, inline: true },
                        { name: i18n.__('black_money'), value: `${formatNumber(accounts.black_money)}`, inline: true },
                    )
                    .setFooter(embedSettings.footer, embedSettings.icon)
                    .setTimestamp()
                message.channel.send(foundUserEmbed)
                return
            });
            return
            } else {
                message.reply(i18n.__('userNotFound'));
                return
            }
        })
  }
};
