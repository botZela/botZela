/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { glob } from 'glob';
import type { Event } from '../../Structures';
import { importFile, logsEmbed } from '../../utils';

const defaultExport: Event<'guildUpdate'> = {
	name: 'guildUpdate',
	async execute(oldGuild, newGuild): Promise<void> {
		if (oldGuild.name === newGuild.name) return;

		// eslint-disable-next-line n/no-path-concat
		const modelsFolder = await glob(`${__dirname}/../../Models/*.{ts,js}`);
		if (!modelsFolder.length) return;

		for (const file of modelsFolder) {
			const Model = await importFile(file);
			const ModelData = await Model.findOne({ guildId: newGuild.id });
			if (ModelData?.guildName) {
				ModelData.guildName = newGuild.name;
				await ModelData.save();
			}
		}

		const log = `Guild Name Changed from "${oldGuild.name}" to "${newGuild.name}".`;
		await logsEmbed(log, newGuild, 'info');
	},
};

export default defaultExport;
