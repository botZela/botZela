import { DMChannel } from 'discord.js';
import gChannels from '../../Models/guildChannels';
import { Event } from '../../Structures';
import { createCommandsChannel, createLogsChannel } from '../../utils/Command&LogsChannels';

const defaultExport: Event<'channelDelete'> = {
	name: 'channelDelete',
	async execute(channel): Promise<void> {
		if (channel instanceof DMChannel) {
			return;
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
