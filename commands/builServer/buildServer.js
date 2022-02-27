const { SlashCommandBuilder } = require("@discordjs/builders");
const { buildServer } = require("../../utils/buildServer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('build_server')
        .setDescription("You could build your server structure using YAML file syntax."),
    async execute(interaction) {
        try {
            interaction.reply({ content: 'Building Server...', ephemeral: true });
            buildServer(interaction.client, interaction);
        } catch (e) {
            await interaction.channel.send("Sorry, you took too long.")
        }
    }
}