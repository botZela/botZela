
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
                {
                    name: "Bot Joind The Server",
                    value: "guildCreate",
                },
                {
                    name: "Bot Left The Server",
                    value: "guildDelete",
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
            case "guildCreate": {
                client.emit("guildCreate", interaction.guild);
                break;
            }
            case "guildDelete": {
                client.emit("guildDelete", interaction.guild);
                break;
            }
        }

        await interaction.reply({ content: `Emitted The event ${choices}`, ephemeral: true });
    },
};