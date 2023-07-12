import type { MessageActionRowComponentBuilder, ModalActionRowComponentBuilder } from 'discord.js';
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	bold,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	WebhookClient,
} from 'discord.js';
import type { ICommand } from '../../../Typings';

const defaultExport: ICommand = {
	name: 'test',
	description: 'Just to test buttons',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'button',
			description: 'Create test Buttons',
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'embed',
			description: 'Create test Embed',
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
		} else if (subCommand === 'embed') {
			const embed = new EmbedBuilder({
				author: {
					name: interaction.member.user.tag,
					iconURL: interaction.member.displayAvatarURL(),
				},
				description: bold(`${interaction.member.user.toString()} created an embed`),
				footer: { text: 'AAAA' },
			}).setTimestamp();
			const webhook = new WebhookClient({
				url: 'https://discord.com/api/webhooks/1008513912544694312/z8NNqFW2YxUOLHJ_uLRh2JCoFYgVVCHdHUO3KPKQkTfsbtfeyXWM7-XDkU7E_pDuOwHa',
			});

			await webhook.send({ embeds: [embed] });
			// await interaction.reply({ embeds: [embed] });
		} else if (subCommand === 'error') {
			throw new Error('Crashing the Bot');
		}
	},
};

export default defaultExport;
