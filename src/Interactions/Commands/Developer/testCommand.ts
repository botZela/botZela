const { MessageActionRow, MessageButton, Interaction} = require("discord.js");

module.exports = {
    name: "testbutton",
    description: "Just to test buttons",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {Interaction} interaction 
     */
    execute({ interaction }){
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setCustomId("Hello")
                .setLabel("Hello")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("Bye")
                .setLabel("Bye")
                .setStyle("DANGER")
        )

        interaction.reply({components: [row]});

    }
    
}