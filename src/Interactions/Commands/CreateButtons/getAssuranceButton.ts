import type { MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import type { ICommand } from '../../../Typings';
import { client } from '../../../index.js';
import { createEmbed } from '../../../utils/index.js';

const defaultExport: ICommand = {
	name: 'button_assurance',
	description: 'Create the Insurance button',
	defaultMemberPermissions: ['Administrator'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	async execute({ interaction }) {
		const { channel, options } = interaction;
		const msgId = options.getString('message');
		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const embed = createEmbed('Get your "Assurance"')
			.setColor('Red')
			.setDescription(
				"To get your Custom __**Assurance**__ press the button below `📥 Waa Tarii9 Siift l'Assurance`, to get your Insurance.\n",
			)
			.addFields([
				{ name: 'Any Suggestions', value: `Consider sending us your feedback in <#922875567357984768>, Thanks.` },
			]);

		row.addComponents(
			new ButtonBuilder()
				.setCustomId('sendAssurance')
				.setLabel("Waa Tarii9 Siift 'Assurance'")
				.setStyle(ButtonStyle.Success)
				.setEmoji('📥'),
		);

		if (!channel) {
			return interaction.followUp({
				content: "Couldn't find the Channel",
				ephemeral: true,
			});
		}

		await interaction.deferReply();
		const inter = await interaction.fetchReply();

		if (msgId) {
			const message = await channel.messages.fetch(msgId);
			await message.edit({ embeds: [embed], components: [row] });
		} else {
			await channel.send({ embeds: [embed], components: [row] });
		}

		if (inter instanceof Message) return inter.delete();
	},
};

export default defaultExport;
