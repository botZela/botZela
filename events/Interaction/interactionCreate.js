const { Client, CommandInteraction, MessageEmbed} = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(client,interaction){
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ An error occured while running this command.")
            ]}) && client.commands.delete(interaction.commandName) ;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } 

    }
}