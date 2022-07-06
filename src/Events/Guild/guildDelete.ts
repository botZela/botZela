import { Event } from '../../Structures';

const defaultExport: Event<'guildDelete'> = {
	name: 'guildDelete',
	async execute(guild) {
		return Promise.resolve(console.log(`[Info] Left server : ${guild.name}`));
	},
};

export default defaultExport;
