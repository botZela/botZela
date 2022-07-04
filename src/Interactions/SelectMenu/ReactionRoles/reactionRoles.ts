import { MessageSelectOption } from 'discord.js';
import { ISelectMenuCommand } from '../../../Typings';

export default {
	id: 'reaction-roles',
	// permissions : ["ADMINISTRATOR"],
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });

		const { values, member } = interaction;

		const component = interaction.component;
		const removed = (component.options as MessageSelectOption[])
			.filter((option): boolean => !values.includes(option.value))
			.map((option) => option.value);

		if (values.length !== 0) {
			member.roles.add(values);
		}
		if (removed.length !== 0) {
			member.roles.remove(removed);
		}

		interaction.followUp({
			content: 'Roles Updated!',
			ephemeral: true,
		});
	},
} as ISelectMenuCommand;
