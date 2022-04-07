const { MessageActionRow, MessageButton, Interaction, MessageSelectMenu} = require("discord.js");

module.exports = {
    name: "button_schedule",
    description: "Create the Schedule button",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {Interaction} interaction 
     */
    execute({ interaction }){
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setCustomId("sendSchedule")
                .setLabel("📅 Get Schedule")
                .setStyle("SUCCESS")
        )

        // TODO : Hide the /button_schedule
        interaction.reply({components: [row]});

    }
    
}