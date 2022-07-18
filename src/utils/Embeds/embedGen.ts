import { EmbedBuilder } from 'discord.js';

export function createEmbed(title: string, description = ''): EmbedBuilder {
	return new EmbedBuilder()
		.setColor(0x0fd64f)
		.setTitle(title)
		.setDescription(description)
		.setFooter({ text: "WHAT'S N3XT TEAM ©" })
		.setTimestamp();
}

export function createErrorEmbed(title: string, description = ''): EmbedBuilder {
	return createEmbed(title, description).setColor('Red');
}

export function createInfoEmbed(title: string, description = ''): EmbedBuilder {
	return createEmbed(title, description).setColor('Green');
}
