import { MessageEmbedOptions } from 'discord.js';
import { messageEmbedOptionsSchema } from '../../Validation/EmbedStructure';

export function buildEmbed(structure: string | null): MessageEmbedOptions | null {
	console.log(structure);
	try {
		if (structure) {
			const embed = JSON.parse(structure) as MessageEmbedOptions;
			console.log(embed);
			const embedOptions = messageEmbedOptionsSchema.parse(embed);
			console.log(embedOptions);
			return embedOptions;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
