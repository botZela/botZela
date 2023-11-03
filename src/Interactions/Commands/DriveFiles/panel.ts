import type { MessageActionRowComponentBuilder } from 'discord.js';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import guildDrive from '../../../Models/guildDrive';
import { checkDriveId, getDriveName, getIdResourceKey } from '../../../OtherModules/GDrive';
import type { DriveFileInterface, ICommand } from '../../../Typings';
import { createEmbed, createErrorEmbed, createInfoEmbed } from '../../../utils';

const defaultExport: ICommand = {
	name: 'drivefiles-panel',
	description: 'Get Drive Files',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'drive',
			type: ApplicationCommandOptionType.String,
			description: 'The url of the drive that you want to create.',
			required: true,
		},
		{
			name: 'name',
			type: ApplicationCommandOptionType.String,
			description: 'Name of the drive folder',
			required: false,
		},
		{
			name: 'message',
			description: 'The message id you want to edit,(it must be sent by the bot).',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],

	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		const { channel, options, guild } = interaction;
		if (!guild || !channel) {
			const embed = createErrorEmbed('Get Files', 'This command is used inside a server ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		const msgId = options.getString('message');
		const driveUrl = options.getString('drive', true);

		const results = getIdResourceKey(driveUrl);
		if (results === null) {
			const embed = createErrorEmbed(
				'Get Files',
				'Please enter a valide drive url (https://drive.google.com/drive/folders/**driveId**)',
			);
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		const folder: DriveFileInterface = {
			name: '',
			id: results.id,
			resourceKey: results.resourceKey,
		};

		if (!(await checkDriveId(folder))) {
			const embed = createErrorEmbed('Get Files', 'The drive url that you provided is not valid');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		folder.name = options.getString('name') ?? (await getDriveName(folder));
		const driveData = await guildDrive.find({ guildId: guild.id, channelId: channel.id });

		const panelEmbed = createEmbed(
			`Get Files `,
			`The easiest way to get access directly to the files that you are looking for.\nCurrent folder : __**${folder.name}**__.\n`,
		).addFields(
			{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
			{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
		);

		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('button-drivefiles-init')
					.setLabel('Get Files')
					.setStyle(ButtonStyle.Success)
					.setEmoji('📙'),
			),
		];

		let sentMessage;
		if (msgId && driveData.map((x) => x.messageId).includes(msgId)) {
			sentMessage = await channel.messages.fetch(msgId);
			await sentMessage.edit({ embeds: [panelEmbed], components });

			driveData.find((x) => x.messageId === msgId)!.driveId = folder.id;
			driveData.find((x) => x.messageId === msgId)!.driveResourceKey = folder.resourceKey;
			driveData.find((x) => x.messageId === msgId)!.driveName = folder.name;
			await driveData.find((x) => x.messageId === msgId)!.save();

			const embed = createInfoEmbed('Get Files', 'The panel was updated with the new drive.');
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
			driveName: folder.name,
			driveId: folder.id,
			driveResourceKey: folder.resourceKey,
		});
		if (msgId) {
			const embed = createInfoEmbed('Get Files', 'The panel was updated with the new drive.');
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		return interaction.followUp({ content: 'The panel was created successfully', ephemeral: true });
	},
};

export default defaultExport;
