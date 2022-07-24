import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { ICommand } from '../../../Typings';
import { buildEmbed } from '../../../utils/SendEmbed';
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
		await interaction.fetchReply().then((inter) => {
			if (inter instanceof Message) return inter.delete();
		});
		const embed = EmbedBuilder.from(embedJson);

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
