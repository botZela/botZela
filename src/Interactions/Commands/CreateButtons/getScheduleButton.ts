import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	Message,
	MessageActionRowComponentBuilder,
} from 'discord.js';
import { client } from '../../..';
import { ICommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: ICommand = {
	name: 'button_schedule',
	description: 'Create the Schedule button',
	permissions: ['Administrator'],
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
		const embed = createEmbed('Get your Schedule Customised for You')
			.setColor('Red')
			.setDescription(
				"To get your Custom Schedule just type whatever you want in this channel, you will get it in Direct Messages.\nOr just press the button below ,`📅 Waa Tarii9 Siift l'emploi`, for more convenience.\n",
			)
			.addFields([
				{
					name: '`️🗑️ Delete old "DMed" Schedules`',
					value: `By pressing this button, all the old messages that the bot sent you will be deleted, except the last two. ⚠️**Use with Caution**⚠️`,
				},
				{ name: 'Any Suggestions', value: `Consider sending us your feedback in <#922875567357984768>, Thanks.` },
			]);

		row.addComponents(
			new ButtonBuilder()
				.setCustomId('sendSchedule')
				.setLabel("Waa Tarii9 Siift l'emploi")
				.setStyle(ButtonStyle.Success)
				.setEmoji('📅'),
		);

		// Row.addComponents(
		//     new MessageButton()
		//         .setCustomId("sendOtherFlGrp")
		//         .setLabel("Other choices")
		//         .setStyle("SECONDARY")
		//         .setEmoji("📅")
		// )

		row.addComponents(
			new ButtonBuilder()
				.setCustomId('schedule_delete_old')
				.setLabel('Delete Old "DMed" Schedules ')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('🗑️'),
		);

		// TODO : Hide the /button_schedule
		if (!channel) {
			return interaction.followUp({
				content: "Couldn't find the Channel",
				ephemeral: true,
			});
		}

		await interaction.deferReply();
		await interaction.fetchReply().then((inter) => {
			if (inter instanceof Message) return inter.delete();
		});
		if (msgId) {
			const message = await channel.messages.fetch(msgId);
			await message.edit({ embeds: [embed], components: [row] });
		} else {
			await channel.send({ embeds: [embed], components: [row] });
		}
	},
};

export default defaultExport;
