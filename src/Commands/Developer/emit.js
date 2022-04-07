
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "emitt",
    description: "Event Emitter",
    permissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "member",
            description: "Guild Member Events",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Member Joined",
                    value: "guildMemberAdd",
                },
                {
                    name: "Member Left",
                    value: "guildMemberRemove",
                },
            ],
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute({ client, interaction }) {
        const choices = interaction.options.getString("member");

        switch (choices) {
            case "guildMemberAdd": {
                client.emit("guildMemberAdd", interaction.member);
                break;
            }
            case "guildMemberRemove": {
                client.emit("guildMemberRemove", interaction.member);
                break;
            }
        }

        await interaction.reply({ content: "Emitted The event", ephemeral: true });
    },
};