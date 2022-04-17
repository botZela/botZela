module.exports = {
    // id: "reaction-roles",
    // permissions : ["ADMINISTRATOR"],
    async execute({ interaction }) {
        await interaction.deferReply({ ephemeral: true});

        const { values, member } = interaction;

        const component = interaction.component;
        const removed = component.options.filter((option) => {
            return !values.includes(option.value);
        }).map((option) => option.value);

        if (values.length !== 0) {
            member.roles.add(values);
        }
        if (removed.length !== 0) {
            member.roles.remove(removed);
        }

        interaction.followUp({
            content: 'Roles Updated!',
            ephemeral: true
        });
    }
}