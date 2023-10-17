import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import type { ICommand } from '../../../Typings';
import { buildEmbed } from '../../../utils/SendEmbed/index.js';

const defaultExport: ICommand = {
	name: 'sendembed',
	description: 'Sends Embed',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'embed',
			description: 'Embed Structure',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	async execute({ interaction }) {
		await interaction.deferReply();
		const { guild, channel, options } = interaction;
		const msgId = options.getString('message');

		if (!guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const structure = interaction.options.getString('embed');
		const embedJson = buildEmbed(structure);

		if (!embedJson) return interaction.followUp({ content: 'Invalid Structure ...', ephemeral: true });
		const inter = await interaction.fetchReply();
		const embed = EmbedBuilder.from(embedJson);

		if (channel) {
			if (msgId) {
				const message = await channel.messages.fetch(msgId);
				await message.edit({ embeds: [embed] });
			} else {
				await channel.send({ embeds: [embed] });
			}
		}

		if (inter instanceof Message) return inter.delete();
	},
};

export default defaultExport;
