const { MessageActionRow, MessageButton, Interaction} = require("discord.js");

module.exports = {
    name: "schedule",
    description: "Create the Schedule button",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {Interaction} interaction 
     */
    execute(interaction){
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setCustomId("sendSchedule")
                .setLabel("📅 Get Schedule")
                .setStyle("SUCCESS")
        )

        interaction.reply({components: [row]});

    }
    
}