import type { MessageActionRowComponentBuilder } from 'discord.js';
import {
	ThreadAutoArchiveDuration,
	ChannelType,
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js';
import { client } from '../../../..';
import ensiasDrive from '../../../../Models/guildDrive-Ensias';
import { checkDriveId, getFile, getIdResourceKey } from '../../../../OtherModules/GDrive';
import type { DriveFileInterface, ICommand } from '../../../../Typings';
import { createEmbed, createErrorEmbed, createInfoEmbed } from '../../../../utils';

const filieresArray = ['2IA', '2SCL', 'BI&A', 'GD', 'GL', 'IDF', 'IDSIT', 'SSE', 'SSI'];
const yearArray = ['1A', '2A', '3A'];

const defaultExport: ICommand = {
	name: 'ensiasfiles',
	description: 'Add and show panel for ensias drives.',
	defaultMemberPermissions: ['Administrator'],
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	options: [
		{
			name: 'add',
			type: ApplicationCommandOptionType.Subcommand,
			description: 'Add a drive folder to the main panel',
			options: [
				{
					name: 'drive',
					type: ApplicationCommandOptionType.String,
					description: 'The url of the drive that you want to create.',
					required: true,
				},
				{
					name: 'year',
					type: ApplicationCommandOptionType.String,
					description: 'Choose the Year',
					choices: yearArray.map((x) => ({ name: x, value: x })),
					required: true,
				},
				{
					name: 'filiere',
					type: ApplicationCommandOptionType.String,
					description: 'Choose the branch',
					choices: filieresArray.map((x) => ({ name: x, value: x })),
					required: true,
				},
				{
					name: 'name',
					type: ApplicationCommandOptionType.String,
					description: 'Name of the drive folder',
					required: false,
				},
			],
		},
		{
			name: 'panel',
			type: ApplicationCommandOptionType.Subcommand,
			description: 'Send the Embed.',
			options: [
				{
					name: 'message',
					description: 'The message id you want to edit,(it must be sent by the bot).',
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
		},
		{
			name: 'panel_post',
			type: ApplicationCommandOptionType.Subcommand,
			description: 'Send the Embed in a Forum Channel.',
			options: [
				{
					name: 'forum',
					description: 'The Form in which you want to create the Button',
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildForum],
					required: true,
				},
				{
					name: 'thread',
					description: 'The id of the Thread you want to modify',
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.PublicThread, ChannelType.AnnouncementThread],
					required: false,
				},
			],
		},
	],
	execute: async ({ interaction }) => {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.inGuild()) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}

		const { channel, options, guild } = interaction;
		if (!guild || !channel) {
			const embed = createErrorEmbed('Get Files', 'This command is used inside a server ...');
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		}

		const subCommand = options.getSubcommand();

		if (subCommand === 'add') {
			const filiere = options.getString('filiere', true);
			const year = options.getString('year', true);
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
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			const fetched = await getFile(folder, ['name', 'mimeType']);
			folder.name = options.getString('name') ?? fetched.name ?? '';
			folder.mimeType = fetched.mimeType ?? 'application/vnd.google-apps.folder';
			const driveData = await ensiasDrive.findOne({ filiere, year });

			if (driveData) {
				driveData.drivesArray.push({
					driveId: folder.id,
					driveResourceKey: folder.resourceKey ?? undefined,
					driveName: folder.name,
					driveMimeType: folder.mimeType,
				});
				await driveData.save();
				const embed = createInfoEmbed(
					'Get Files',
					`The drive for the year: __**${year}**__ and branch:__** ${filiere}**__ was Updated successfully`,
				);
				return interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			}

			await ensiasDrive.create({
				filiere,
				year,
				drivesArray: [
					{
						driveName: folder.name,
						driveId: folder.id,
						driveResourceKey: folder.resourceKey,
						driveMimeType: folder.mimeType,
					},
				],
			});
			const embed = createInfoEmbed(
				'Get Files',
				`The drive for the year: __**${year}**__ and branch:__** ${filiere}**__ was created successfully`,
			);
			return interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}

		if (subCommand.startsWith('panel')) {
			const embed = createEmbed(
				`Get Files `,
				`The easiest way to get access directly to the files that you are looking for.\n(Cours, TD, TP, Exams, Lasse9at, ...)`,
			).addFields(
				{ name: 'Any Suggestions', value: 'Consider sending us your feedback in <#922875567357984768>, Thanks.' },
				{ name: 'Any Errors', value: 'Consider sending us your feedback in <#939564676038140004>, Thanks.' },
			);

			const components = [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('button-ensiasfiles-init')
						.setLabel('Get Files')
						.setStyle(ButtonStyle.Success)
						.setEmoji('📚'),
				),
			];

			if (subCommand === 'panel') {
				const msgId = options.getString('message');

				if (msgId) {
					const sentMessage = await channel.messages.fetch(msgId);
					await sentMessage.edit({ embeds: [embed], components });
				} else {
					await channel.send({ embeds: [embed], components });
				}
			} else {
				const forum = options.getChannel('forum', true, [ChannelType.GuildForum]);
				const thread = options.getChannel('thread', false, [
					ChannelType.PublicThread,
					// ChannelType.PrivateThread,
					ChannelType.AnnouncementThread,
				]);

				if (thread) {
					// We can use this if we can find a way to remove system messages
					// await thread.edit({
					// 	name: '『📁』 Ensias Drive',
					// 	autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
					// });
					await (
						await thread.fetchStarterMessage()
					)?.edit({
						embeds: [embed],
						components,
					});
				} else {
					await forum.threads.create({
						name: '『📁』 Ensias Drive',
						autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
						message: {
							embeds: [embed],
							components,
						},
					});
				}
			}

			return interaction.followUp({ content: 'The panel was created successfully', ephemeral: true });
		}
	},
};

export default defaultExport;
