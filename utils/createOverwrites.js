function createOverwrites(client, guild, rolesList) {
    if (!rolesList) return;
    overwrites = [{
            id: guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"],
        },
        {
            id: client.user.id,
            allow: ['VIEW_CHANNEL'],
        }
    ]

    for (role of rolesList) {
        try {
            overwrites.push({
                id: ROLES[`${guild.id}`][role],
                allow: ['VIEW_CHANNEL']
            })
        } catch (e) {
            console.log(`[INFO] Role ${role} was not found for guild ${guild.name}`);
        }
    }
    return overwrites;
}

module.exports = {
    createOverwrites,
}