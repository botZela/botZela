import type { Event } from '../../Structures';

const defaultExport: Event<'guildDelete'> = {
	name: 'guildDelete',
	async execute(guild) {
		console.log(`[Info] Left server : ${guild.name}`);
	},
};

export default defaultExport;
