import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);

import { logsMessage } from '../../utils';
import { Event } from '../../Structures';

export default {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild): Promise<void> {
		if (oldGuild.name === newGuild.name) return;

		const modelsFolder = await PG(`${__dirname}/../../Models/*.js`);
		if (!modelsFolder.length) return;

		for (let file of modelsFolder) {
			const Model = require(file);
			const ModelData = await Model.findOne({ guildId: newGuild.id });
			if (ModelData?.guildName) {
				ModelData.guildName = newGuild.name;
				await ModelData.save();
			}
		}

		let log = `[INFO] Guild Name Changed from "${oldGuild.name}" to "${newGuild.name}".`;
		await logsMessage(log, newGuild);
	},
} as Event<'guildUpdate'>;
