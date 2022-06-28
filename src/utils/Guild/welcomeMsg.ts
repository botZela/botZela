import { greetings } from './greetings';
import gChannels from '../../Models/guildChannels';
import { GuildMember } from 'discord.js';

export async function welcomeMsg(member: GuildMember) {
	let msg = greetings(member.id);
	try {
		const guildChannels = (await gChannels.findOne({ guildId: member.guild.id }))?.channels;
		if (!guildChannels) {
			return msg;
		}
		const channel_id = guildChannels.get('INTRODUCE');
		if (channel_id) {
			msg += '\n' + `Please introduce yourself in <#${channel_id}> .Enjoy your stay!`;
		} else {
			console.log(`[INFO] Introduce Channel is not defined in ${member.guild.name}`);
		}
		return msg;
	} catch (error) {
		console.error(error);
		return '';
	}
}
