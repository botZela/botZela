const { MessageEmbed } = require("discord.js");

function createEmbed(title, description = "") {
    let embed = new MessageEmbed()
        .setColor(0x0fd64f)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: "WHAT'S N3XT TEAM ©" })
        .setTimestamp();
    return embed;
}

module.exports = {
    createEmbed,
}