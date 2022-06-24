const sendInsurance = require("../../Commands/Assurance/getAssurance").execute;

module.exports = {
    id: "sendAssurance",
    cooldown: 10 * 60 * 1000,
    // permissions : ["ADMINISTRATOR"],
    execute({ client,interaction }) {
        sendInsurance({ client,interaction });
    }
}