
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "emit",
    description: "Event Emitter",
    permissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "event",
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
        {
            name: "member",
            description: "The Member to execute the event on.",
            type: "USER",
            required: false,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute({ client, interaction }) {
        const choices = interaction.options.getString("event");
        const member = interaction.options.getMember("member") || interaction.member;

        switch (choices) {
            case "guildMemberAdd": {
                client.emit("guildMemberAdd", member);
                break;
            }
            case "guildMemberRemove": {
                client.emit("guildMemberRemove", member);
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