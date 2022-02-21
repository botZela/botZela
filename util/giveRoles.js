function giveRoles(member, roles){
    const guild = member.guild();
    member.roles.add(roles);
}

module.exports = {
    giveRoles,
}