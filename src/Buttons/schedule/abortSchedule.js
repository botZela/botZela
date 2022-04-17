

module.exports = {
    // id: "abortSchedule",
    // cooldown: 15 * 60 * 1000,
    // permissions : ["ADMINISTRATOR"],
    execute({ client,interaction }) {
        interaction.update({
            content:`You just Aborted the process`,
            embeds: [],
            components:[]
        });
    }
}