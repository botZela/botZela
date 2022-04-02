const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Sends Back PONG",
    permissions: [],
    data : new SlashCommandBuilder()
            .setName('ping')
            .setDescription("This is a description!!!"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction){
      
        await interaction.reply({ content: 'PONG', ephemeral: true });
    }
}