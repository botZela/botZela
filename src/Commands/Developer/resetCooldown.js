const { CommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "resetcooldown",
    description: "Reset the cooldown for all users or just a member.",
    permissions: ["ADMINISTRATOR"],
    guilds : [
        client.testGuilds.find(guild => guild.name.includes("ENSIAS"))?.id || "" ,
    ],
    options: [
        {
            name: "member",
            description: "The member that you want to reset the cooldown.",
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
        const member = interaction.options.getMember("member") || "";

        if (member) {
            client.buttonsCooldown.forEach((guilds) => {
                guilds.forEach((members) => {
                    if (members.includes(member.id)){
                        const index = members.indexOf(member.id);
                        if (index > -1){
                            members.splice(index,1);
                        }
                    }
                })
            });
        }else {
            client.buttonsCooldown.forEach((guilds) => {
                guilds.forEach((members) => {
                    members.splice(0,members.length);
                });
            });
        }
        await interaction.reply({ content: `Reseted the cooldowns for ${member || "everyone"}`, ephemeral: true });
    },
};