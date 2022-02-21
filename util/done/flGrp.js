function flGrp(member){
    const roles = [];
    let i = 0;
    for (let role in member.roles){
        roles[i] = role.name;
        i++;
    }
    fl = roles[2].slice(1,-1);
    grp = roles[1];
    return fl,grp;
}