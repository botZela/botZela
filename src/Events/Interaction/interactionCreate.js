const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @returns
     */
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return (
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setDescription("⛔ An error occured while running this command."),
                        ],
                    }) && client.commands.delete(interaction.commandName)
                );

            try {
                if (command.permissions && !command.permissions.any((perm) => interaction.member.permissions.has(perm))) {
                    await interaction.reply({
                        content: "Sorry you can't use this Command/Button.",
                        ephemeral: true,
                    });
                } else {
                    await command.execute({ client, interaction });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
