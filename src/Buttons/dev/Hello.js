module.exports = {
    id: "Hello",
    permissions : ["ADMINISTRATOR"],
    execute(interaction) {
        interaction.reply({content: "YES! You just pressed Hello", ephemeral:true});
    }
}