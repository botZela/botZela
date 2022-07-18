import { APIEmbed } from 'discord.js';
// import yaml from "js-yaml";
// import { messageEmbedOptionsSchema } from '../../Validation/EmbedStructure';

export function buildEmbed(structure: string | null): APIEmbed | null {
	try {
		if (structure) {
			const embed = JSON.parse(structure) as APIEmbed;
			// const embed = yaml.load(structure.replaceAll('\\n','\n')) as MessageEmbedOptions;
			// const embedOptions = messageEmbedOptionsSchema.parse(embed);
			// console.log(embedOptions);
			// return embedOptions;
			return embed;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
