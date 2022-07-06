import { GuildMember } from 'discord.js';
import { greetings } from './greetings';
import gChannels from '../../Models/guildChannels';

export async function welcomeMsg(member: GuildMember) {
	let msg = greetings(member.id);
	try {
		const guildChannels = (await gChannels.findOne({ guildId: member.guild.id }))?.channels;
		if (!guildChannels) {
			return msg;
		}
		const channelId = guildChannels.get('INTRODUCE');
		if (channelId) {
			msg += `\nPlease introduce yourself in <#${channelId}> .Enjoy your stay!`;
		} else {
			console.log(`[INFO] Introduce Channel is not defined in ${member.guild.name}`);
		}
		return msg;
	} catch (error) {
		console.error(error);
		return '';
	}
}
