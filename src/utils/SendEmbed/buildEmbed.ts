import { APIEmbed } from 'discord.js';

export function buildEmbed(structure: string | null): APIEmbed | null {
	try {
		if (structure) {
			const embed = JSON.parse(structure) as APIEmbed;
			return embed;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
