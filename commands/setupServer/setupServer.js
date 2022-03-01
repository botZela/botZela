const { SlashCommandBuilder } = require("@discordjs/builders");
const { setupServer } = require("../../utils/setupServer");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_server')
        .setDescription("Setup the server with SpreadSheet"),
    async execute(interaction) {
        await interaction.reply({ content: 'Setuping Server...', ephemeral: true });
        await setupServer(interaction.client, interaction);
    }
}