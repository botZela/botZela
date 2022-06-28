import { MessageEmbed } from 'discord.js';

export function createEmbed(title: string, description = ''): MessageEmbed {
	let embed = new MessageEmbed()
		.setColor(0x0fd64f)
		.setTitle(title)
		.setDescription(description)
		.setFooter({ text: "WHAT'S N3XT TEAM ©" })
		.setTimestamp();
	return embed;
}
