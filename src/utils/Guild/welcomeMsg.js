const { greetings } = require("./greetings.js");

function welcomeMsg(client,member) {
    const { CHANNELS } = client.data;
    try {
        let channel_id = CHANNELS[`${member.guild.id}`]["INTROD"];
        let msg = greetings(member);
        if (channel_id){
            msg += "\n" + `Please introduce yourself in <#${ channel_id }> .Enjoy your stay!`;
        } else {
            console.log(`[INFO] Introduce Channel is not defined in ${member.guild.name}`);
        }
        return msg;

    } catch (error) {
        return console.error(error);
    }
}

module.exports = {
    welcomeMsg,
}