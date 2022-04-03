const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute(client, interaction){
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);

        if(Button.permissions && !Button.permissions.some((perm) => interaction.member.permissions.has(perm))) {
            return interaction.reply({content: "You are missing permissions.", ephemeral: true});
        }

        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({content: "You are not the owner.", ephemeral: true});
        }

        Button.execute(interaction);
    }
}