const sendSchedule = require("../../commands/schedule/getSchedule").execute;

module.exports = {
    id: "sendSchedule",
    permissions : ["ADMINISTRATOR"],
    execute(interaction) {
        sendSchedule(interaction);
        // interaction.reply({content: "YES! You just pressed Hello", ephemeral:true});
    }
}