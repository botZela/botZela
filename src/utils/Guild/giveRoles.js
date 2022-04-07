
async function giveRoles(member, roles){
    await member.roles.add(roles);
}

module.exports = {
    giveRoles,
}
