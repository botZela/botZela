const { createEmbed } = require("../../utils/createEmbed");
const { flGrp } = require("../../utils/Schedule/flGrp");
const { logsMessage } = require("../../utils/logsMessage");
const { sendSchedule } = require("../../utils/Schedule/sendSchedule");
const { client } = require("../../index");

module.exports = {
    name: "getschedule",
    description: "Get your schedule based on your group and field.",
    cooldown: 10*1000,
    // permissions: [],
    guilds : [
        client.testGuilds.find(guild => guild.name.includes("ENSIAS"))?.id || "" ,
    ],
    options : [
        {
            name: "filiere",
            type: "STRING",
            description: "Choose the branch",
            choices: [
                { name: "2IA", value: "2IA" },
                { name: "2SCL", value: "2SCL" },
                { name: "BI&A", value: "BI&A" },
                { name: "GD", value: "GD" },
                { name: "GL", value: "GL" },
                { name: "IDF", value: "IDF" },
                { name: "IDSIT", value: "IDSIT" },
                { name: "SSE", value: "SSE" },
                { name: "SSI", value: "SSI" }
            ],
            required: false,
        },
        {
            name: "groupe",
            type: "STRING",
            description: "Choose the groupe",
            choices: [
                { name: "G1", value: "G1" }, 
                { name: "G2", value: "G2" },
                { name: "G3", value: "G3" },
                { name: "G4", value: "G4" },
                { name: "G5", value: "G5" },
                { name: "G6", value: "G6" },
                { name: "G7", value: "G7" },
                { name: "G8", value: "G8" }
            ],
            required: false,
        },
        {
            name: "dm",
            type: "BOOLEAN",
            description: "Do you want to receive your schedule in Direct Messages?",
            value: "True",
            required: false,
        },
    ],
    async execute({ client, interaction }) {
        const { options, member,guild } = interaction;
        await interaction.deferReply({ephemeral:true});
        if (guild.id != client.testGuilds[0].id) {
            return interaction.followUp({
                content: "This command is not available for this server.",
                ephemeral: true
            });
        }
        if (!member.roles.cache.map((role) => role.name).includes("1A")){
            return interaction.followUp({
                content: "This command is only available for 1A Students. Sorry!",
                ephemeral: true
            });
        }

        const { filiere:fl , groupe:grp} = flGrp(member);
        const filiere = options? options.getString("filiere") || fl : fl;
        const groupe = options? options.getString("groupe") || grp : grp;

        if (!filiere || !groupe) {
            return interaction.followUp({
                content: "CHAFAAAAAAR",
                ephemeral: false
            });
        }

        let dm = options? (options.getBoolean("dm") == null ? true: options.getBoolean("dm")) : true;
        if(dm) sendSchedule(member,filiere,groupe);

        // let text = `__**Your Schedule of this week :**__ \n__Filiere__: ${filiere}\n__Groupe__: ${groupe}\n` ;
        // let fileNamePng = `Emploi_${filiere}_${groupe}.png`;
        // let fileNamePdf = `Emploi_${filiere}_${groupe}.pdf`;
        // let embed = createEmbed(`Schedule ${filiere} ${groupe}`, "__**Your Schedule of this week :**__ ");
        let text = `__**The Planning of S2 Finals.**__ ` ;
        let fileNamePng1 = `Planning_Rattrapages_S2-1.png`;
        let fileNamePng2 = `Planning_Rattrapages_S2-2.png`;
        let fileNamePdf = `Planning_Rattrapages_S2.pdf`;
        let embed = createEmbed(`Finals Schedule`, "__**Finals Schedule (Rattrapages)**__ ");
        // let fileNamePng1 = `Planning_examens_S2-1.png`;
        // let fileNamePng2 = `Planning_examens_S2-2.png`;
        // let fileNamePdf = `Planning_examens_S2.pdf`;
        // let embed = createEmbed(`Finals Schedule`, "__**Finals Schedule**__ ");
        await interaction.followUp({ 
            content: text, 
            embeds: [embed],
            files: [
                `./data/Schedules/emploi_1A/${fileNamePdf}`, 
                `./data/Schedules/emploi_1A/${fileNamePng1}`,
                `./data/Schedules/emploi_1A/${fileNamePng2}`,
            ],
            ephemeral: true 
        });
        let logs = `[INFO] .${member.nickname || member.user.tag} got their finals (Rattrapages) Schedule.`;
        await logsMessage(client, logs, interaction.guild);
    }
}