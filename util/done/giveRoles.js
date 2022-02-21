async function giveRoles(member, roles){
    const guild = member.guild();
    await member.roles.add(roles);
}

module.exports = {
    giveRoles,
}