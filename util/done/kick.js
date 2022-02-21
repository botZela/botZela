function kick(member) {
    member.send(`You did not fill the form correctly(like we said it is automated and you got kicked from the server).\n\
Please Consider refilling the form using this username : ${member.name}in the Discord Username:\n\n\
https://forms.gle/6XoXUAZiRkvWw8Rp9 \n\n\
After refiling the form you can rejoin the server without getting kicked\n\n\
https://discord.gg/yDbrgnnC4D\n\
Thanks for your Understanding.`);
    member.kick();
}

module.exports = {
    kick,
}