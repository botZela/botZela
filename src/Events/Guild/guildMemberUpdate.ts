import type { Event } from '../../Structures';
import { client } from '../../index.js';
import { logsEmbed } from '../../utils/index.js';

const defaultExport: Event<'guildMemberUpdate'> = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember): Promise<void> {
		if (oldMember.pending && !newMember.pending) {
			client.emit('guildMemberAdd', newMember);
			await logsEmbed(
				`%user% completed the Membership Screening. (Accepted the rules)`,
				newMember.guild,
				'info',
				newMember,
			);
		}
	},
};

export default defaultExport;
