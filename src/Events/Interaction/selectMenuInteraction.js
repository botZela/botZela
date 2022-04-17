const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    async execute(client, interaction){
        if(!interaction.isSelectMenu()) return;

        const {customId, guild, member} = interaction;
        const SelectMenu = client.selectMenu.get(customId);

        if (!SelectMenu){
            return interaction.reply({content: "this `Select Menu` is not handle for now.", ephemeral: true});
        }

        if(SelectMenu.permissions && !SelectMenu.permissions.some((perm) => member.permissions.has(perm))) {
            return interaction.reply({content: "You are missing permissions.", ephemeral: true});
        }

        if(SelectMenu.ownerOnly && interaction.member.id !== guild.ownerId) {
            return interaction.reply({content: "You are not the owner.", ephemeral: true});
        }

        SelectMenu.execute({ client,interaction });

    }
}