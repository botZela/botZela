import { ApplicationCommandOptionType, CategoryChannel, GuildBasedChannel, StageChannel } from 'discord.js';
import { z } from 'zod';
import gChannels from '../../../Models/guildChannels';
import linksModel from '../../../Models/guildLinks';
import gRoles from '../../../Models/guildRoles';
import { ICommand } from '../../../Typings';
import { checkSpreadsheet } from '../../../utils/SetupServer/checkLinks';
import { setupServer } from '../../../utils/SetupServer/setupServer';

type TChannelObj = { COMMAND: string } | { INTRODUCE: string } | { LOGS: string };

const defaultExport: ICommand = {
	name: 'setup',
	description: 'Setup the server',
	options: [
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'channels',
			description: 'Setup channels.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'logs',
					description: 'Setup the logs Channel',
					options: [
						{
							name: 'channel',
							description: 'logs Channel',
							type: ApplicationCommandOptionType.Channel,
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'commands',
					description: 'Setup the commands Channel',
					options: [
						{
							name: 'channel',
							description: 'commands Channel',
							type: ApplicationCommandOptionType.Channel,
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'introduce',
					description: 'Setup the introduce Channel',
					options: [
						{
							name: 'channel',
							description: 'introduce Channel',
							type: ApplicationCommandOptionType.Channel,
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: 'link',
			description: 'Setup server Links.',
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'spreadsheet',
					description: 'Setup the Spreadsheet for the server',
					options: [
						{
							name: 'url',
							description: 'The url of the Spreadsheet',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: 'form',
					description: 'Setup the Spreadsheet for the server',
					options: [
						{
							name: 'url',
							description: 'The url of the From',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'server',
			description: 'Setup Guide.',
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'default_role',
			description: 'Define the default role of the server',
			options: [
				{
					name: 'role',
					description: 'The Default role of the server',
					type: ApplicationCommandOptionType.Role,
					required: true,
				},
			],
		},
	],
	permissions: ['Administrator', 'ManageRoles'],
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });
		const { guild } = interaction;
		if (!guild) {
			return interaction.followUp({ content: 'This command is used inside a server ...', ephemeral: true });
		}
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'server') {
			await setupServer(interaction);
			return interaction.followUp({ content: 'Setting up the server .... ', ephemeral: true });
		} else if (subCommand === 'default_role') {
			const guildData = await gRoles.findOne({ guildId: guild.id });
			const roleData = interaction.options.getRole('role');
			if (!roleData) {
				return interaction.followUp({ content: 'Choose a valid role', ephemeral: true });
			}
			if (guildData) {
				guildData.defaultRole = roleData.id;
				await guildData.save();
			}
			return interaction.followUp({ content: 'Default Role Added Successfully', ephemeral: true });
		}
		const subCommandGroup = interaction.options.getSubcommandGroup();
		if (subCommandGroup === 'channels') {
			const channel = interaction.options.getChannel('channel') as GuildBasedChannel;
			if (channel instanceof CategoryChannel || channel instanceof StageChannel) {
				return;
			}
			const guildData = await gChannels.findOne({ guildId: guild.id });
			const channelType = subCommand.toUpperCase();

			if (guildData) {
				guildData.channels.set(channelType, channel.id);
				await guildData.save();
			} else {
				const channelsObj: TChannelObj = JSON.parse(`{
                    "${channelType}": "${channel.id}"
                }`) as TChannelObj;
				await gChannels.create({
					guildId: guild.id,
					guildName: guild.name,
					channels: channelsObj,
				});
			}
			await channel.send('This channel is Up and running');
			return interaction.followUp({
				content: `[INFO] ${channelType} Added Successfully`,
				ephemeral: true,
			});
		} else if (subCommandGroup === 'link') {
			const linkChecker = z.string().url();
			let link;
			try {
				link = linkChecker.parse(interaction.options.getString('url'));
			} catch (e) {
				return await interaction.followUp({ content: `Please enter a valid Link ( https://....) `, ephemeral: true });
			}
			if (subCommand === 'spreadsheet') {
				await checkSpreadsheet(interaction, link);
			} else if (subCommand === 'form') {
				const guildData = await linksModel.findOne({ guildId: guild.id });
				if (guildData) {
					guildData.form = link;
					await guildData.save();
				} else {
					await linksModel.create({
						guildId: guild.id,
						guildName: guild.name,
						form: link,
					});
				}
				return interaction.followUp({ content: `This server's Form Link Added Successfully.`, ephemeral: true });
			}
		}

		await interaction.followUp({ content: 'Setting up the server .... ', ephemeral: true });
	},
};

export default defaultExport;
