const { logsMessage } = require("./logsMessage");
const { sendSchedule } = require("./sendSchedule");

async function getSchedule(interaction) {
    /* if (!interaction.user.bot) {
        await interaction.delete();
    }; */
    let filieres = {
        "922635302743453717": "_2IA_",
        "922635332409761873": "_2SCL_",
        "922635365125333042": "_BI&A_",
        "922635408221814854": "_GD_",
        "921523102624677999": "_GL_",
        "922635438039130193": "_IDF_",
        "922635468384907345": "_IDSIT_",
        "922635499083026444": "_SSE_",
        "922635535871250462": "_SSI",
        "948564863276449823": "_SSI_"
    }
    let groupes = {
        "922625077894332457": "G1",
        "922625109729087548": "G2",
        "922625135058505809": "G3-",
        "922625157275742219": "G4",
        "922625184211554334": "G5",
        "922625246190772335": "G7",
        "922625216646119445": "G6",
        "922625282698002443": "G8",
        "948565045858684980": "G3"
    }
    let roles = interaction.member.roles.cache.keys();
    let fl, grp;
    for (let role of roles) {
        if (filieres[role]) {
            fl = filieres[role];
        }
        if (groupes[role]) {
            grp = groupes[role];
        }
    }
    if (grp && fl) {
        await sendSchedule(interaction.member, fl, grp);
        await interaction.channel.send({
            content: `${interaction.user}\`\`\`css\n[INFO] Your Schedule for branch .${fl.slice(1,-1)} and groupe .${grp} is sent to your DMs.\n\`\`\``,
            ephemeral: true
        })
        let logs = `[INFO] .${interaction.user.tag} got his schedule for branch .${fl.slice(1,-1)} and groupe .${grp}`;
        await logsMessage(interaction.client, logs, interaction.guild);
        console.log(logs);
    }
}
module.exports = {
    getSchedule,
}