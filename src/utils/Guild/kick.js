async function kick(member, guild) {
    if ( !(["921408078983876678","979396566018322482"].includes(str(guild.id)))){
        return;
    } 
    let formUrl,inviteUrl;
    if (guild.id == "979396566018322482"){
        formUrl = "https://forms.gle/oyKyzc225jw7vAhc8"; 
        inviteUrl = "https://discord.gg/27khZuVstQ"; 
    } else if (guild.id == "921408078983876678"){
        formUrl = "https://forms.gle/6XoXUAZiRkvWw8Rp9" ; 
        inviteUrl = "https://discord.gg/yDbrgnnC4D" ; 
    }

    await member.send(`You did not fill the form correctly(like we said it is automated and you got kicked from the server).\n\
Please Consider refilling the form using this username : ${member.name}in the Discord Username:\n\n\
${formURL}\n\n\
After refiling the form you can rejoin the server without getting kicked\n\n\
${inviteUrl}\n\
Thanks for your Understanding.`);
    // await member.kick();
}

module.exports = {
    kick,
}