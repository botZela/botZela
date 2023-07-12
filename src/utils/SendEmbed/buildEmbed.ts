import type { APIEmbed } from 'discord.js';

export function buildEmbed(structure: string | null): APIEmbed | null {
	try {
		if (structure) {
			return JSON.parse(structure) as APIEmbed;
		}

		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
