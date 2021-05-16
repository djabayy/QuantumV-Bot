

const { member } = message;
if (!member.hasPermission('ADMINISTRATOR')) {
    message.reply(language.__('noPermission'));
    return
}

const arguments = content.split(/[ ]+/)
arguments.shift()

if (arguments.length < 1) {
    message.reply(language.__('no_arguments_provided', `${prefix}restart [${language.__('script_name')}]`))
    return
}
cl.connect();
cl.send(`restart ${arguments[0]}`)
cl.on('response', function(str) {
    if (str.startsWith(`rint ^3Couldn't find resource`)) {
        message.reply(language.__('resource_not_found'))
        return
    } else {
        const string = str.replace('rint', '').replace('^3', '').replace('^7', '')
        const serverOutput = new discord.MessageEmbed()
        .setTitle(language.__('resource_restarted'))
        .setDescription(string)
        .setColor('#39435b')
        .setFooter(embedSettings.footer, embedSettings.icon)
        .setTimestamp()
        message.reply(serverOutput)
        return
    }
})