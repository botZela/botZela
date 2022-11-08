import { EmbedBuilder } from 'discord.js';

export function createEmbed(title: string, description?: string): EmbedBuilder {
	const newEmbed = new EmbedBuilder({
		color: 0x0fd64f,
		footer: { text: 'botZela TEAM ©' },
		timestamp: Date.now(),
	});
	if (title && title !== '') newEmbed.setTitle(title);
	if (description && description !== '') newEmbed.setDescription(description);
	return newEmbed;
}

export function createErrorEmbed(title: string, description = ''): EmbedBuilder {
	return createEmbed(title, description).setColor('Red');
}

export function createInfoEmbed(title: string, description = ''): EmbedBuilder {
	return createEmbed(title, description).setColor('Green');
}
