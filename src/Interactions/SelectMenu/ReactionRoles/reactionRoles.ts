import { MessageSelectOption, SelectMenuComponent } from 'discord.js';
import { ISelectMenuCommand } from '../../../Typings';

const defaultExport: ISelectMenuCommand = {
	id: 'reaction-roles',
	// Permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });

		const { values, member } = interaction;

		const component = interaction.component as SelectMenuComponent;
		const removed = (component.options as MessageSelectOption[])
			.filter((option): boolean => !values.includes(option.value))
			.map((option) => option.value);

		if (values.length !== 0) {
			await member.roles.add(values);
		}
		if (removed.length !== 0) {
			await member.roles.remove(removed);
		}

		await interaction.followUp({
			content: 'Roles Updated!',
			ephemeral: true,
		});
	},
};

export default defaultExport;
