const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "set-log-channel",
    // description: "setup log channel",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute({ interaction }){
      
        await interaction.reply({ content: 'PONG', ephemeral: true });
    }
}