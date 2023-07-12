import { DMChannel } from 'discord.js';
import autoReactChannels from '../../Models/autoReactChannels.js';
import gChannels from '../../Models/guildChannels.js';
import type { Event } from '../../Structures';
import { createCommandsChannel, createLogsChannel } from '../../utils/Command&LogsChannels/index.js';
import { logsEmbed } from '../../utils/index.js';

const defaultExport: Event<'channelDelete'> = {
	name: 'channelDelete',
	async execute(channel): Promise<void> {
		if (channel instanceof DMChannel) {
			return;
		}

		const reactionData = await autoReactChannels.findOne({ channelId: channel.id });
		if (reactionData) {
			await reactionData.deleteOne();
			await logsEmbed(`AutoReaction Channel "${channel.name}" has been deleted`, channel.guild, 'warn');
		}

		const guildData = await gChannels.findOne({ guildId: channel.guildId });
		if (!guildData) {
			return;
		}

		const guildChannels = guildData.channels;

		if (channel.id === guildChannels.get('COMMANDS')) {
			await createCommandsChannel(channel.guild, undefined, channel.parent ?? undefined);
		} else if (channel.id === guildChannels.get('LOGS')) {
			await createLogsChannel(channel.guild, undefined, channel.parent ?? undefined);
		}
	},
};

export default defaultExport;
