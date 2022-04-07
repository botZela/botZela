const { createEmbed } = require("../createEmbed");

async function sendSchedule(member, filiere, groupe) {
    let fileNamePng = `Emploi_${filiere}_${groupe}.png`;
    let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
    let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
    await member.send({
        embeds: [embed]
    })
    await member.send({
        files: [`./data/emploi/${fileNamePdf}`, `./data/emploi/${fileNamePng}`]
    })
}
module.exports = {
    sendSchedule,
}