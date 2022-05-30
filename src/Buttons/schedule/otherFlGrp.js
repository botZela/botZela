const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");

const sendSchedule = require("../../Commands/Schedule/getSchedule").execute;

module.exports = {
    // id: "sendOtherFlGrp",
    // cooldown: 15 * 60 * 1000,
    // permissions : ["ADMINISTRATOR"],
    async execute({ client,interaction }) {
        const row1 = new MessageActionRow();
        const row2 = new MessageActionRow();
        const row3 = new MessageActionRow();
        const embed = 
            new MessageEmbed()
                .setColor("RED")
                .setTitle("Get the Schedule for any Branch or groupe you like.")
                .setDescription("Choose below the branch and the filiere you want.")
                .addField(
                    "Any Suggestions",
                    `Consider sending us your feedback in <#922875567357984768>, Thanks.`
                );
        
        let filieresArray = ["2IA", "2SCL", "BI&A", "GD", "GL", "IDF", "IDSIT", "SSE", "SSI"];
        let groupesArray = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

        const filieres = filieresArray.map((x) => {
            return {
                label: x,
                value: x,
                description: `Schedule for filiere \`${x}\``,
            };
        });
        const groupes = groupesArray.map((x) => {
            return {
                label: x,
                value: x,
                description: `Schedule for groupe \`${x}\``,
            };
        });
                
        row1.addComponents(
            new MessageSelectMenu()
                .setCustomId("filiere")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(filieres)
        );

        row2.addComponents(
            new MessageSelectMenu()
                .setCustomId("groupe")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(groupes)
        );

        row3.addComponents(
            new MessageButton()
                .setCustomId("confirmSchedule")
                .setLabel("Confirm")
                .setStyle("SUCCESS")
                .setEmoji("✅"),
        );

        row3.addComponents(
            new MessageButton()
                .setCustomId("abortSchedule")
                .setLabel("Abort")
                .setStyle("DANGER")
                .setEmoji("🛑"),
        );

        await interaction.reply({
            embeds:[embed], 
            components: [row1,row2,row3],
            ephemeral: true,
        });
    }
}