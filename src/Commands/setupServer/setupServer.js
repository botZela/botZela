const { setupServer } = require("../../utils/SetupServer/setupServer");


module.exports = {
    name: "setup_server",
    // description: "Setup the server with SpreadSheet",
    permissions: ["ADMINISTRATOR","MANAGE_ROLES"],
    async execute({ interaction } ) {
        await interaction.reply({ content: 'Setuping Server...', ephemeral: true });
        await setupServer(interaction.client, interaction);
    }
}