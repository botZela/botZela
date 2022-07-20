import { client } from '../..';
import { Event } from '../../Structures';
import { logsMessage } from '../../utils';

const defaultExport: Event<'guildMemberUpdate'> = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember): Promise<void> {
		if (oldMember.pending && !newMember.pending) {
			client.emit('guildMemberAdd', newMember);
			await logsMessage(
				`[INFO] ${newMember.user.tag} completed the Membership Screening. (Accepted the rules)`,
				newMember.guild,
			);
		}
	},
};

export default defaultExport;
