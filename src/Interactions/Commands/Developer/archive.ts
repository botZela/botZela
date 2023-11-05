import { ChannelType, ApplicationCommandOptionType } from 'discord.js';
import type { ICommand } from '../../../Typings';
import { fetchAllMessages } from '../../../utils/messages/fetchAll';

const channelTypes = [
	ChannelType.AnnouncementThread,
	ChannelType.PublicThread,
	ChannelType.GuildText,
	ChannelType.PrivateThread,
] as const;

const defaultExport: ICommand = {
	name: 'archive',
	description: 'Copy content of a channel to another (channel/post/thread)',
	defaultMemberPermissions: ['Administrator'],
	options: [
		{
			name: 'source',
			description: 'Channel/Post/Thread Source',
			type: ApplicationCommandOptionType.Channel,
			channelTypes,
			required: true,
		},
		{
			name: 'destination',
			description: 'Channel/Post/Thread Destination',
			type: ApplicationCommandOptionType.Channel,
			channelTypes,
			required: true,
		},
		{
			name: 'copy',
			description: 'Kind of data to copy',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: 'all',
					value: 'all',
				},
				{
					name: 'media',
					value: 'media',
				},
			],
		},
	],
	async execute({ interaction }) {
		await interaction.deferReply({ ephemeral: true });
		const { options } = interaction;
		const source = options.getChannel('source', true, channelTypes);
		const destination = options.getChannel('destination', true, channelTypes);
		const copy = options.getString('copy', true);
		const messages = await fetchAllMessages(source, true);

		const msgSent = messages.length;

		let threads;

		if (source.type === ChannelType.GuildText) {
			threads = await source.threads.fetch();
		}

		let webhookDest;

		if (destination.type === ChannelType.GuildText) {
			webhookDest =
				(await destination.fetchWebhooks()).at(0) ?? (await destination.createWebhook({ name: 'archiver' }));
		} else {
			const parent = destination.parent!;
			webhookDest = (await parent.fetchWebhooks()).at(0) ?? (await parent.createWebhook({ name: 'archiver' }));
		}

		for (const msg of messages) {
			try {
				await webhookDest.send({
					// Webhook params
					username: msg.member?.displayName,
					avatarURL: msg.member?.displayAvatarURL() ?? undefined,
					threadId: destination.isThread() ? destination.id : undefined,
					// Content
					content: copy === 'all' ? msg.content : undefined,
					components: copy === 'all' ? msg.components : undefined,
					embeds: msg.embeds,
					files: msg.attachments.toJSON(),
				});
			} catch (error) {
				console.error(error);
			}
		}

		if (threads) {
			for (const thread of threads.threads.values()) {
				const messages = await fetchAllMessages(thread, true);
				const threadOwner = await thread.fetchOwner();
				try {
					await webhookDest.send({
						// Webhook params
						username: threadOwner?.guildMember?.displayName,
						avatarURL: threadOwner?.guildMember?.displayAvatarURL() ?? undefined,
						threadId: destination.isThread() ? destination.id : undefined,
						// Content
						content: `---- starting thread **${thread.name}** ----`,
					});
				} catch (error) {
					console.error(error);
				}

				for (const msg of messages) {
					try {
						if (
							msg.embeds.length > 0 ||
							msg.attachments.size > 0 ||
							msg.content.length > 0 ||
							msg.components.length > 0
						)
							await webhookDest.send({
								// Webhook params
								username: msg.member?.displayName,
								avatarURL: msg.member?.displayAvatarURL() ?? undefined,
								threadId: destination.isThread() ? destination.id : undefined,
								// Content
								content: copy === 'all' ? msg.content : undefined,
								components: copy === 'all' ? msg.components : undefined,
								embeds: msg.embeds,
								files: msg.attachments.toJSON(),
							});
					} catch (error) {
						console.error(error);
					}
				}

				try {
					await webhookDest.send({
						// Webhook params
						username: threadOwner?.guildMember?.displayName,
						avatarURL: threadOwner?.guildMember?.displayAvatarURL() ?? undefined,
						threadId: destination.isThread() ? destination.id : undefined,
						// Content
						content: `---- end thread **${thread.name}** ----`,
					});
				} catch (error) {
					console.error(error);
				}
			}
		}

		return interaction.followUp({
			content: `archived : ${msgSent ?? 0}`,
		});
	},
};

export default defaultExport;
