const rrModel = require('../../Models/reactionRoles');


module.exports = {
    // name: 'add-role',
    description: 'Add a custom reaction role',
    permissions: ["ADMINISTRATOR"],
    options: [
        {
            name: 'role',
            description: "role to be assigned",
            type: "ROLE",
            required: true
        },
        {
            name: 'description',
            description: "description of this role",
            type: "STRING",
            required: false
        },
        {
            name: 'emoji',
            description: "emoji for the role",
            type: "STRING",
            required: false
        },
    ],
    execute: async ({client, interaction}) => {
        const { options } = interaction;
        const role = options.getRole("role");
        const roleDescription = options.getString("description") || null;
        const roleEmoji = options.getString("emoji") || null;

        if (role.position >= interaction.guild.me.roles.highest.position) {
            return interaction.reply({content:"I can't assign a role that is higher or equal than me.",ephemeral:true});
        }

        const guildData = await rrModel.findOne({ guildId: interaction.guildId });

        const newRole = {
            roleId: role.id,
            roleDescription,
            roleEmoji,
        }

        if (guildData){
            const roleData = guildData.roles.find((x) => x.roleId === role.id);

            if (roleData){
                roleData = newRole;
            } else {
                guildData.roles.push(newRole);
            }

            await guildData.save();
        } else {
            await rrModel.create({
                guildId: interaction.guildId,
                roles: newRole,
            })
        }

        interaction.reply({content: `Created a new Role : ${role.name}`, ephemeral: true});

    }
}