const { createEmbed } = require("../../utils/createEmbed");
const linksModel = require("../../Models/guildLinks");

async function kick(member, guild) {

    let formLink, inviteLink;
    const linksData = await linksModel.findOne({guildId: guild.id});
    if (linksData){
        formLink = linksData?.form || '';
    }
    if (guild.systemChannel){
        const inviteOptions = {
            maxAge: 30 * 60,
            maxUses: 1,
            unique: true,
        };
        inviteLink = (await guild.invites.create(guild.systemChannel.id,inviteOptions)).url;

    }
    let embed = createEmbed(`${guild.me.user.username}`, `You did not fill the form correctly(like we said it is automated and you got kicked from the server).\n\nPlease Consider refilling the form \n\n\
    ${formLink}\n\nusing this username : \`${member.user.tag}\` in the Discord Username Field.\n
    After refiling the form you can rejoin the server without getting kicked using this link\n\n\
    ${inviteLink}\n\n\
    Thanks for your Understanding.`);
    await member.send({
        embeds:[embed],
    });
    await member.kick();
}

module.exports = {
    kick,
}
