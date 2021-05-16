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

const validateWeapons = (weapons) => {
  const validWeapons = [
    "WEAPON_KNIFE",
    "WEAPON_KNUCKLE",
    "WEAPON_NIGHTSTICK",
    "WEAPON_HAMMER",
    "WEAPON_BAT",
    "WEAPON_GOLFCLUB",
    "WEAPON_CROWBAR",
    "WEAPON_BOTTLE",
    "WEAPON_DAGGER",
    "WEAPON_HATCHET",
    "WEAPON_MACHETE",
    "WEAPON_FLASHLIGHT",
    "WEAPON_SWITCHBLADE",
    "WEAPON_PROXMINE",
    "WEAPON_BZGAS",
    "WEAPON_SMOKEGRENADE",
    "WEAPON_MOLOTOV",
    "WEAPON_FIREEXTINGUISHER",
    "WEAPON_PETROLCAN",
    "WEAPON_HAZARDCAN",
    "WEAPON_SNOWBALL",
    "WEAPON_FLARE",
    "WEAPON_BALL",
    "WEAPON_REVOLVER",
    "WEAPON_POOLCUE",
    "WEAPON_PIPEWRENCH",
    "WEAPON_PISTOL",
    "WEAPON_PISTOL_MK2",
    "WEAPON_COMBATPISTOL",
    "WEAPON_APPISTOL",
    "WEAPON_PISTOL50",
    "WEAPON_SNSPISTOL",
    "WEAPON_HEAVYPISTOL",
    "WEAPON_VINTAGEPISTOL",
    "WEAPON_STUNGUN",
    "WEAPON_FLAREGUN",
    "WEAPON_MARKSMANPISTOL",
    "WEAPON_MICROSMG",
    "WEAPON_MINISMG",
    "WEAPON_SM",
    "WEAPON_SMG_MK2",
    "WEAPON_ASSAULTSMG",
    "WEAPON_MG",
    "WEAPON_COMBATMG",
    "WEAPON_COMBATMG_MK2",
    "WEAPON_COMBATPDW",
    "WEAPON_GUSENBERG",
    "WEAPON_MACHINEPISTOL",
    "WEAPON_ASSAULTRIFLE",
    "WEAPON_ASSAULTRIFLE_MK2",
    "WEAPON_CARBINERIFLE",
    "WEAPON_CARBINERIFLE_MK2",
    "WEAPON_ADVANCEDRIFLE",
    "WEAPON_SPECIALCARBINE",
    "WEAPON_BULLPUPRIFLE",
    "WEAPON_COMPACTRIFLE",
    "WEAPON_PUMPSHOTGUN",
    "WEAPON_SWEEPERSHOTGUN",
    "WEAPON_SAWNOFFSHOTGUN",
    "WEAPON_BULLPUPSHOTGUN",
    "WEAPON_ASSAULTSHOTGUN",
    "WEAPON_MUSKET",
    "WEAPON_HEAVYSHOTGUN",
    "WEAPON_DBSHOTGUN",
    "WEAPON_SNIPERRIFLE",
    "WEAPON_HEAVYSNIPER",
    "WEAPON_HEAVYSNIPER_MK2",
    "WEAPON_MARKSMANRIFLE",
    "WEAPON_GRENADELAUNCHER",
    "WEAPON_GRENADELAUNCHER_SMOKE",
    "WEAPON_RPG",
    "WEAPON_MINIGUN",
    "WEAPON_FIREWORK",
    "WEAPON_RAILGUN",
    "WEAPON_HOMINGLAUNCHER",
    "WEAPON_GRENADE",
    "WEAPON_STICKYBOMB",
    "WEAPON_COMPACTLAUNCHER",
    "WEAPON_SNSPISTOL_MK2",
    "WEAPON_REVOLVER_MK2",
    "WEAPON_DOUBLEACTION",
    "WEAPON_SPECIALCARBINE_MK2",
    "WEAPON_BULLPUPRIFLE_MK2",
    "WEAPON_PUMPSHOTGUN_MK2",
    "WEAPON_MARKSMANRIFLE_MK2",
    "WEAPON_RAYPISTOL",
    "WEAPON_RAYCARBINE",
    "WEAPON_RAYMINIGUN",
    "WEAPON_DIGISCANNER",
    "WEAPON_NAVYREVOLVER",
    "WEAPON_CERAMICPISTOL",
    "WEAPON_STONE_HATCHET",
    "WEAPON_PIPEBOMB",
    "GADGET_PARACHUTE",
  ];
  if (!validWeapons.includes(weapons)) {
    return false;
  }
  return true;
};

var i18n_module = require("i18n-nodejs");
var i18n = new i18n_module(config.lang, config.langFile);

module.exports = class StartResourceCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "giveweapon",
      group: "fivem",
      memberName: "giveweapon",
      description: i18n.__("giveweapon_command_description"),
      argsType: "multiple",
      userPermissions: ["MANAGE_CHANNELS"],
      examples: [".giveitem [ID] [WEAPON_NAME] [AMMO]"],
    });
  }

  async run(message, args) {
    if (deleteCommandUsage) message.delete();
    if (message.author.bot) return;

    if (args.length < 3) {
      message.reply(i18n.__("invalid_syntax_giveitem"));
      return;
    }

    const weaponName = args[1].toUpperCase();

    if (!validateWeapons(weaponName)) {
      const invalidWeapon = new MessageEmbed()
        .setColor("#39435b")
        .setDescription(i18n.__("invalid_weapon", { weapon: args[1] }));
      message.embed(invalidWeapon);
      return;
    }

    cl.connect();
    // cl.send(`giveweapon ${args[0]} ${args[1]} ${args[2]}`);
    cl.on("response", function (str) {
      if (
        str ==
        "rint [es_extended] [^3WARNING^7] There is no player online matching that server id^7"
      ) {
        message.reply(i18n.__("id_not_matching"));
        return;
      } else if (str == "rint") {
        const gaveWeapon = new MessageEmbed()
          .setColor("#39435b")
          .setDescription(i18n.__("gave_weapon"))
          .addFields(
            { name: i18n.__("weapon"), value: args[1] },
            { name: i18n.__("user"), value: args[0] },
            { name: i18n.__("ammo"), value: args[2] }
          );
        message.embed(gaveWeapon);
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
