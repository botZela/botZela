import { Event } from '../../Structures';

export default {
	name: 'guildDelete',
	async execute(guild) {
		console.log(`[Info] Left server : ${guild.name}`);
	},
} as Event<'guildDelete'>;
