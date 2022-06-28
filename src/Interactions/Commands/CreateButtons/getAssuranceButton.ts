import { MessageActionRow, MessageButton, Interaction, MessageEmbed, Message } from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';

export default {
	name: 'button_assurance',
	description: 'Create the Insurance button',
	permissions: ['ADMINISTRATOR'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id || ''],
	options: [
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: 'STRING',
			required: false,
		},
	],
	async execute({ interaction }): Promise<void> {
		const msgId = interaction.options.getString('message');
		const row = new MessageActionRow();
		const embed = new MessageEmbed()
			.setColor('RED')
			.setTitle('Get your "Assurance"')
			.setDescription(
				"To get your Custom __**Assurance**__ press the button below `📥 Waa Tarii9 Siift l'Assurance`, to get your Insurance.\n",
			)
			.addField('Any Suggestions', `Consider sending us your feedback in <#922875567357984768>, Thanks.`);

		row.addComponents(
			new MessageButton()
				.setCustomId('sendAssurance')
				.setLabel("Waa Tarii9 Siift l'Assurance")
				.setStyle('SUCCESS')
				.setEmoji('📥'),
		);

		if (msgId) {
			await interaction.deferReply();
			interaction.fetchReply().then((inter) => {
				if (inter instanceof Message) return inter.delete();
			});
			const message = await interaction.channel.messages.fetch(msgId);
			message.edit({ embeds: [embed], components: [row] });
		} else {
			await interaction.deferReply();
			interaction.fetchReply().then((inter) => {
				if (inter instanceof Message) return inter.delete();
			});
			await interaction.channel.send({ embeds: [embed], components: [row] });
		}
	},
} as ICommand;
