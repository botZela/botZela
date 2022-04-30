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
    // let fileNamePng = `Emploi_${filiere}_${groupe}.png`;
    // let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
    // let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
    let text = `__**The Planning of S2 Finals.**__ ` ;
    let fileNamePng1 = `Planning_examens_S2-1.png`;
    let fileNamePng2 = `Planning_examens_S2-2.png`;
    let fileNamePdf = `Planning_examens_S2.pdf`;
    let embed = createEmbed(`Finals Schedule`, "__**Finals Schedule**__ ");
    await member.send({
        embeds: [embed]
    })
    await member.send({
        files: [
            `./data/Schedules/emploi_1A/${fileNamePdf}`, 
            `./data/Schedules/emploi_1A/${fileNamePng1}`,
            `./data/Schedules/emploi_1A/${fileNamePng2}`,
        ],
        // components: [row]
    })
}
module.exports = {
    sendSchedule,
}