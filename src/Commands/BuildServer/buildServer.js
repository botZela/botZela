const { buildServer } = require("../../utils/BuildServer/buildServer");

module.exports = {
    name: "build_server",
    // description: "You could build your server structure using YAML file syntax.",
    permissions: ["ADMINISTRATOR","MANAGE_CHANNELS"],
    async execute({ interaction }) {
        await interaction.reply({ content: 'Building Server...', ephemeral: true });
        await buildServer(interaction.client, interaction);
    }
}