const { greetings } = require("./greetings.js");

function welcomeUser(member) {
    try {
        console.log(`${member.guild.id}`);
        channel_id = CHANNELS[`${member.guild.id}`]["INTROD"];
        msg = greetings(member) + "\n" + `Please introduce yourself in <#${ channel_id }> .Enjoy your stay!`;
        return msg;
    } catch (error) {

        console.log(`Introduce Channel is not defined in ${member.guild.name}`);
        return greetings(member);
    }
}

module.exports = {
    welcomeUser,
}