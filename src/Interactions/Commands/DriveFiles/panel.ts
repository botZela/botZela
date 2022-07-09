import { MessageActionRow, MessageButton, MessageEmbedOptions } from 'discord.js';
import guildDrive from '../../../Models/guildDrive';
import { checkDriveId, getDriveName } from '../../../OtherModules/GDrive';
import { ICommand } from '../../../Typings';
import { createEmbed } from '../../../utils';

const defaultExport: ICommand = {
	name: 'drivefiles-panel',
	description: 'Get Drive Files',
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'drive',
			type: 'STRING',
			description: 'The id of the drive that you want to create.',
			required: true,
		},
		{
			name: 'name',
			type: 'STRING',
			description: 'Name of the drive folder',
			required: false,
		},
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: 'STRING',
			required: false,
		},
	],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		const { channel, options, guild } = interaction;
		if (!guild || !channel) {
			const embed: MessageEmbedOptions = {
				color: 'RED',
				title: 'Get Files',
				description: 'This command is used inside a server ...',
			};
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		const msgId = options.getString('message');
		const driveId = options.getString('drive');

		if (!driveId) {
			const embed: MessageEmbedOptions = {
				color: 'RED',
				title: 'Get Files',
				description: 'Please enter a drive Id (https://drive.google.com/drive/u/0/folders/**driveId**)',
			};
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		if (!(await checkDriveId(driveId))) {
			const embed: MessageEmbedOptions = {
				color: 'RED',
				title: 'Get Files',
				description: 'The drive Id that you provided is not valid',
			};
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}
		const driveName = options.getString('name') ?? (await getDriveName(driveId));
		const driveData = await guildDrive.find({ guildId: guild.id, channelId: channel.id });

		const panelEmbed = createEmbed(
			`Get Files `,
			`The easiest way to get access directly to the files that you are looking for.\nCurrent folder : __**${driveName}**__.\n`,
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

		let sentMessage;
		if (msgId && driveData.map((x) => x.messageId).includes(msgId)) {
			sentMessage = await channel.messages.fetch(msgId);
			await sentMessage.edit({ embeds: [panelEmbed], components });
			driveData.find((x) => x.messageId === msgId)!.driveId = driveId;
			await driveData.find((x) => x.messageId === msgId)!.save();
			const embed: MessageEmbedOptions = {
				color: 'GREEN',
				title: 'Get Files',
				description: 'The panel was updated with the new drive.',
			};
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		if (msgId) {
			sentMessage = await channel.messages.fetch(msgId);
			await sentMessage.edit({ embeds: [panelEmbed], components });
		} else {
			sentMessage = await channel.send({ embeds: [panelEmbed], components });
		}
		await guildDrive.create({
			guildId: guild.id,
			channelId: channel.id,
			guildName: guild.name,
			messageId: sentMessage.id,
			driveName,
			driveId,
		});
		if (msgId) {
			const embed: MessageEmbedOptions = {
				color: 'GREEN',
				title: 'Get Files',
				description: 'The panel was updated with the new drive.',
			};
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}
		return interaction.followUp({ content: 'The panel was created successfully', ephemeral: true });
	},
};

export default defaultExport;
