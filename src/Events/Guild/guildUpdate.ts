/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { promisify } from 'util';
import { glob } from 'glob';
const PG = promisify(glob);

import { Event } from '../../Structures';
import { importFile, logsMessage } from '../../utils';

const defaultExport: Event<'guildUpdate'> = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild): Promise<void> {
		if (oldGuild.name === newGuild.name) return;

		const modelsFolder = await PG(`${__dirname}/../../Models/*.{ts,js}`);
		if (!modelsFolder.length) return;

		for (const file of modelsFolder) {
			const Model = await importFile(file);
			const ModelData = await Model.findOne({ guildId: newGuild.id });
			if (ModelData?.guildName) {
				ModelData.guildName = newGuild.name;
				await ModelData.save();
			}
		}

		const log = `[INFO] Guild Name Changed from "${oldGuild.name}" to "${newGuild.name}".`;
		await logsMessage(log, newGuild);
	},
};

export default defaultExport;
