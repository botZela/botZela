module.exports = {
    id: "Bye",
    // permissions : ["ADMINISTRATOR"],
    execute(interaction) {
        interaction.reply({content: "NOOO! You just pressed Bye", ephemeral:true});
    }
}