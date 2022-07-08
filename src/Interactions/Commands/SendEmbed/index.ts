import { Message } from 'discord.js';
import { ICommand } from '../../../Typings';
import { buildEmbed } from '../../../utils/SendEmbed';
const defaultExport: ICommand = {
	name: 'sendembed',
	description: 'Sends Embed',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'embed',
			description: 'Embed Structure',
			type: 'STRING',
			required: true,
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
		const embed = buildEmbed(structure);

		if (!embed) return interaction.followUp({ content: 'Invalid Structure ...', ephemeral: true });
		await interaction.fetchReply().then((inter) => {
			if (inter instanceof Message) return inter.delete();
		});

		if (channel) {
			if (msgId) {
				const message = await channel.messages.fetch(msgId);
				await message.edit({ embeds: [embed] });
			} else {
				await channel.send({ embeds: [embed] });
			}
		}
	},
};

export default defaultExport;
