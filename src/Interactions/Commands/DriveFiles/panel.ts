import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { ICommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: ICommand = {
	name: 'drivefiles-panel',
	description: 'Get Drive Files',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: 'STRING',
			required: false,
		},
	],

	execute: async ({ interaction }) => {
		await interaction.deferReply();

		if (!interaction.inGuild()) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const { channel, options } = interaction;
		const msgId = options.getString('message');

		const panelEmbed = createEmbed(
			`Get Files `,
			`The easiest way to get access directly to the files that you are looking for.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('button-drivefiles-init')
					.setLabel('Get Files')
					.setStyle('SUCCESS')
					.setEmoji('📙'),
			),
		];

		await interaction.fetchReply().then((inter) => {
			if (inter instanceof Message) return inter.delete();
		});

		if (channel) {
			if (msgId) {
				const message = await channel.messages.fetch(msgId);
				await message.edit({ embeds: [panelEmbed], components });
			} else {
				await channel.send({ embeds: [panelEmbed], components });
			}
		}
	},
};

export default defaultExport;
