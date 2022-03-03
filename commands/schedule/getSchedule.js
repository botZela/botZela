const { SlashCommandBuilder } = require("@discordjs/builders");
const { getSchedule } = require("../../utils/getSchedule");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getschedule')
        .setDescription("Get your schedule based on your group and field."),
    async execute(interaction) {
        await interaction.reply({ content: "Your Schedule:", ephemeral: true });
        await getSchedule(interaction);
    }
}