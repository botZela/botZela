const { createEmbed } = require("../../utils/createEmbed");
const { flGrp } = require("../../utils/Schedule/flGrp");
const { logsMessage } = require("../../utils/logsMessage");
const { client } = require("../../index");
const fs = require('fs');

function firstLastName (nickname ) {
    const arrayName = nickname.split(/ +/g);
    if (arrayName.length === 2){
        return {
            lastName: arrayName.at(0).toUpperCase(),
            firstName: arrayName.at(1).toUpperCase(),
        }
    }
    let lastNameArray = [];
    let firstNameArray = [];
    arrayName.forEach(name => {
        if (name === name.toUpperCase()){
            lastNameArray.push(name);
        }else {
            firstNameArray.push(name);
        }
    });
    return { 
        lastName: lastNameArray.join(" ").toUpperCase(),
        firstName: firstNameArray.join(" ").toUpperCase(),
    }
};

module.exports = {
    name: "getassurance",
    description: "Get your schedule based on your group and field.",
    cooldown: 10*1000,
    // permissions: [],
    guilds : [
        client.testGuilds.find(guild => guild.name.includes("ENSIAS"))?.id || "" ,
    ],
    options : [
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

        if (guild.id != client.testGuilds.find(server => server.name.includes("ENSIAS")).id) {
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

        const { filiere } = flGrp(member);
        const { lastName, firstName } = firstLastName(member.nickname);

        if (!filiere || !member.nickname) {
            return interaction.followUp({
                content: "CHAFAAAAAAR",
                ephemeral: false
            });
        }

        let text = `__**1A Insurance.**__ ` ;
        let fileNamePdf = `${lastName} ${firstName}.pdf`;
        let pdfPath = `./data/Schedules/Assurances_1A/${filiere}/${fileNamePdf}`;

        if (!fs.existsSync(pdfPath)){
            fileNamePdf = `${firstName} ${lastName}.pdf`;
            pdfPath = `./data/Schedules/Assurances_1A/${filiere}/${fileNamePdf}`;
            if (!fs.existsSync(pdfPath)){
                return interaction.followUp({
                    content: "Can't find Your Insurance. Please Check your nickname, and tell the problem to one of the <@&921522743604813874>",
                    ephemeral: false,
                });
            }
        }
        let embed = createEmbed(`Assurance 1A`, "__**Your \"Assurance\" is ready**__ ");
        await interaction.followUp({ 
            content: text, 
            embeds: [embed],
            files: [
                pdfPath,
            ],
            ephemeral: true 
        });

        let dm = options? (options.getBoolean("dm") == null ? true: options.getBoolean("dm")) : true;
        if (dm) {
            await member.send({
                embeds: [embed]
            });
            await member.send({
                files: [
                    pdfPath,
                ],
            });
        };
        let logs = `[INFO] .${member.nickname || member.user.tag} got their Insurance.`;
        await logsMessage(client, logs, interaction.guild);
    }
}