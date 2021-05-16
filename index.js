const path = require("path");
const Commando = require("discord.js-commando");
const {
  token,
  database,
  embedSettings,
  deleteCommandUsage,
  prefix,
  lang,
} = require("./config.json");
const mysql = require("mysql");

var config = {
  lang: lang,
  langFile: "./../../locales/locales.json",
};

var i18n_module = require("i18n-nodejs");
var i18n = new i18n_module(config.lang, config.langFile);

// var connection = mysql.createConnection({
//     host: database.host,
//     user: database.user,
//     port: database.port,
//     database: database.database,
//     password: database.password
// })

const client = new Commando.CommandoClient({
  owner: "597681967697362947",
  commandPrefix: prefix,
});

client.on("ready", function () {
  console.log(i18n.__("ready", { ver: "1.0.0" }));

  client.registry
    .registerGroups([["fivem", "FiveM Befehle"]])
    // .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});
// }
// Login with the token of the config
client.login(token);
