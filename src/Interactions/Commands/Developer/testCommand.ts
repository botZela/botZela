import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	MessageActionRowComponentBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'test',
	description: 'Just to test buttons',
	permissions: ['Administrator'],
	options: [
		{
			name: 'button',
			description: 'Create test Buttons',
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'modal',
			description: 'Create test Modal',
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'error',
			description: 'Throw an Error',
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	async execute({ interaction }) {
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'button') {
			const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder({
					customId: 'Hello',
					label: 'Hello',
					style: ButtonStyle.Success,
				}),
				new ButtonBuilder().setCustomId('Bye').setLabel('Bye').setStyle(ButtonStyle.Danger),
			);
			await interaction.reply({ components: [row] });
		} else if (subCommand === 'modal') {
			const modal = new ModalBuilder().setTitle('Test Modal').setCustomId('testmodal');
			const textInput1 = new TextInputBuilder({
				customId: 'test1',
				label: 'Question 1',
				style: TextInputStyle.Short,
			});
			const textInput2 = new TextInputBuilder({
				customId: 'test2',
				label: 'Question 2',
				style: TextInputStyle.Paragraph,
			});
			const action1 = new ActionRowBuilder<ModalActionRowComponentBuilder>({
				components: [textInput1],
			});
			const action2 = new ActionRowBuilder<ModalActionRowComponentBuilder>({
				components: [textInput2],
			});
			modal.addComponents(action1, action2);
			await interaction.showModal(modal);
		} else if (subCommand === 'error') {
			throw new Error('Crashing the Bot');
		}
	},
};

export default defaultExport;
