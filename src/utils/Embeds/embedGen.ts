import { MessageEmbed } from 'discord.js';

export function createEmbed(title: string, description = ''): MessageEmbed {
	return new MessageEmbed()
		.setColor(0x0fd64f)
		.setTitle(title)
		.setDescription(description)
		.setFooter({ text: "WHAT'S N3XT TEAM ©" })
		.setTimestamp();
}

export function createErrorEmbed(title: string, description = ''): MessageEmbed {
	return createEmbed(title, description).setColor('RED');
}

export function createInfoEmbed(title: string, description = ''): MessageEmbed {
	return createEmbed(title, description).setColor('GREEN');
}
