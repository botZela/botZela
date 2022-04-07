const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Sends Back PONG",
    permissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute({client, interaction }){
      
        await interaction.reply({ content: `PONG after \`${client.ws.ping}ms\``, ephemeral: true });
    }
}