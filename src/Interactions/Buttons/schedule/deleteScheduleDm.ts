

module.exports = {
    // id: "DeleteMsgSchedule",
    // cooldown: 15 * 60 * 1000,
    // permissions : ["ADMINISTRATOR"],
    async execute({ client,interaction }) {
        const dm = await interaction.user.createDM()
        const toDel = await dm.send("You deleted the schedule from your dm.");
        const msgsToDel = (await dm.messages.fetch({limit : 10, before:toDel.id})).filter((m) => m.author.id === client.user.id);

        for (let i = 0; i < 2; i++){
            msgsToDel.at(i).delete();
        }
        setTimeout(() => {
            toDel.delete();
        },1000);
    }
}