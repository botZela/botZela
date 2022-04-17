const { MessageActionRow, MessageButton } = require("discord.js");
const { createEmbed } = require("../createEmbed");

async function sendSchedule(member, filiere, groupe) {
    const row = new MessageActionRow();
    row.addComponents(
        new MessageButton()
            .setCustomId("DeleteMsgSchedule")
            .setLabel("Delete Me")
            .setStyle("DANGER")
    )
    let fileNamePng = `Emploi_${filiere}_${groupe}.png`;
    let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
    let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
    await member.send({
        embeds: [embed]
    })
    await member.send({
        files: [`./data/emploi/${fileNamePdf}`, `./data/emploi/${fileNamePng}`],
        // components: [row]
    })
}
module.exports = {
    sendSchedule,
}