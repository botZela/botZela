const { Interaction } = require("discord.js");
const { flGrp } = require("../flGrp");
const { logsMessage } = require("../logsMessage");
const { sendSchedule } = require("../sendSchedule");

/**
 * 
 * @param {Interaction} interaction 
 */
async function getSchedule(interaction) {
    const {filiere, groupe} = flGrp(interaction.member);

    if (filiere && groupe) {
        await sendSchedule(interaction.member, filiere, groupe);
        await interaction.channel.send({ content: `${interaction.user}\`\`\`css\n[INFO] Your Schedule for branch .${filiere} and groupe .${groupe} is sent to your DMs.\n\`\`\``, });
    }
}
module.exports = {
    getSchedule,
}