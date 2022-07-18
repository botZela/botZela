import {
	ApplicationCommandOptionType,
	CategoryChannel,
	ChannelType,
	GuildBasedChannel,
	StageChannel,
} from 'discord.js';
import { z } from 'zod';
import autoReactChannels from '../../../Models/autoReactChannels';
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
			name: 'autoreact',
			description: 'Setup autoReaction for specifique Channels',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'enable',
					description: 'Enable/Update the auto reaction',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'channel',
							description: 'The channel in which you want to enable auto reaction',
							type: ApplicationCommandOptionType.Channel,
							channel_types: [ChannelType.GuildText],
							required: true,
						},
						{
							name: 'emojis',
							description: 'A space seperated list of the emojis (👍 👎)',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: 'random',
							description: 'Randomize the output of the reactions',
							type: ApplicationCommandOptionType.Boolean,
							required: false,
						},
						{
							name: 'number',
							description: 'number of Reactions ( if random is true)',
							type: ApplicationCommandOptionType.Number,
							required: false,
						},
					],
				},
				{
					name: 'disable',
					description: 'Disable the auto reaction',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'channel',
							description: 'The channel in which you want to disable auto reaction',
							type: ApplicationCommandOptionType.Channel,
							channel_types: [ChannelType.GuildText],
							required: true,
						},
					],
				},
			],
		},
		{
			name: 'channels',
			description: 'Setup channels.',
			type: ApplicationCommandOptionType.SubcommandGroup,
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
		} else if (subCommandGroup === 'autoreact') {
			const subCommand = interaction.options.getSubcommand();
			if (subCommand === 'enable') {
				const channel = interaction.options.getChannel('channel', true);
				const emojis = interaction.options.getString('emojis', true);
				const emojisArray = emojis.split(/ +/);
				const random = interaction.options.getBoolean('random') ?? false;
				const numberOfReactions = (random ? interaction.options.getNumber('number') : null) ?? emojisArray.length;

				const reactionData = await autoReactChannels.findOne({ channelId: channel.id });
				if (reactionData) {
					reactionData.reactions = emojisArray;
					reactionData.random = random;
					reactionData.numberOfReactions = numberOfReactions;
					await reactionData.save();
				} else {
					await autoReactChannels.create({
						guildId: interaction.guild!.id,
						guildName: interaction.guild!.name,
						channelId: channel.id,
						reactions: emojisArray,
						random,
						numberOfReactions,
					});
				}
				await interaction.followUp({
					content: `Created an auto reaction in <#${channel.id}> with these emojis ${JSON.stringify(emojisArray)} `,
					ephemeral: true,
				});
			} else if (subCommand === 'disable') {
				const channel = interaction.options.getChannel('channel', true);
				const reactionData = await autoReactChannels.findOne({ channelId: channel.id });
				if (reactionData) {
					reactionData.delete();
					await interaction.followUp({
						content: `Disabled auto reaction from <#${channel.id}>`,
						ephemeral: true,
					});
				} else {
					await interaction.followUp({
						content: `No auto reaction was set in <#${channel.id}>`,
						ephemeral: true,
					});
				}
			}
			return;
		}

		await interaction.followUp({ content: 'Setting up the server .... ', ephemeral: true });
	},
};

export default defaultExport;
