const sendSchedule = require("../../Commands/Schedule/getSchedule").execute;

module.exports = {
    id: "sendSchedule",
    cooldown: 15 * 60 * 1000,
    permissions : ["ADMINISTRATOR"],
    execute({ client,interaction }) {
        sendSchedule({ client,interaction });
    }
}