const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data : new SlashCommandBuilder()
            .setName('ping')
            .setDescription("This is a description!!!"),
    async execute(interaction){
        await interaction.reply({ content: 'PONG', ephemeral: true });
    }
}