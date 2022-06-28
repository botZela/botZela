const rrModel = require('../../Models/reactionRoles');


module.exports = {
    // name: 'remove-role',
    description: 'remove a custom Reaction role',
    permissions: ["ADMINISTRATOR"],
    options: [
        {
            name: 'role',
            description: "role to be Removed",
            type: "ROLE",
            required: true
        },
    ],
    execute: async ({client, interaction}) => {
        const { options } = interaction;
        const role = options.getRole("role");

        const guildData = await rrModel.findOne({ guildId: interaction.guildId });

        if (!guildData){
            return interaction.reply({content: "There is no roles inside of this server.", ephemeral:true});
        }

        const guildRoles = guildData.roles;

        const findRole = guildRoles.find((x) => x.roleId === role.id);

        if (!findRole) {
            return interaction.reply({content: "That role is not added to the reaction roles list.", ephemeral:true});
        }

        const filteredRoles = guildRoles.filter((x) => x.roleId !== role.id);
        guildData.roles = filteredRoles;

        await guildData.save();

        interaction.reply({content: `Removed : ${role.name}`, ephemeral: true});

    }
}