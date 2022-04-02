const { SlashCommandBuilder } = require("@discordjs/builders");
const { buildServer } = require("../../utils/buildServer");

module.exports = {
    name: "build_server",
    description: "You could build your server structure using YAML file syntax.",
    permissions: ["ADMINISTRATOR","MANAGE_CHANNELS"],
    data: new SlashCommandBuilder()
        .setName('build_server')
        .setDescription("You could build your server structure using YAML file syntax."),
    async execute(interaction) {
        await interaction.reply({ content: 'Building Server...', ephemeral: true });
        await buildServer(interaction.client, interaction);
    }
}