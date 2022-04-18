const buttonInteractions = require("../../Events/Interaction/buttonInteractions");

module.exports = {
    id: "Bye",
    cooldown: 20*1000,
    permissions : ["ADMINISTRATOR"],
    /**
     * 
     * @param {buttonInteraction} interaction 
     */
    execute({ interaction }) {
        interaction.reply({content: "NOOO! You just pressed Bye", ephemeral:true});
        for (let i = 0; i < 100;i++){
            interaction.member.send(i.toString());
        }
    }
}