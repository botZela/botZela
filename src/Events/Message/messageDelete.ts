import gDrive from '../../Models/guildDrive';
import { Event } from '../../Structures';
import { logsEmbed } from '../../utils';

const defaultExport: Event<'messageDelete'> = {
	name: 'messageDelete',
	async execute(message) {
		const driveData = await gDrive.findOne({ messageId: message.id });
		if (driveData) {
			driveData.delete();
			if (message.guild) await logsEmbed(`Removed a DriveFile Panel Successfully`, message.guild, 'warn');
			else console.log('[INFO] Message Deleted');
		}
	},
};

export default defaultExport;
