import type { Guild, GuildMember } from 'discord.js';
import { ChannelType } from 'discord.js';
import linksModel from '../../Models/guildLinks.js';
import { createEmbed } from '../Embeds/index.js';

export async function kick(member: GuildMember, guild: Guild) {
	let formLink = '';
	let channelId: string;
	const linksData = await linksModel.findOne({ guildId: guild.id });
	if (linksData) {
		formLink = linksData.form ?? '';
	}

	const inviteOptions = {
		maxAge: 30 * 60,
		maxUses: 1,
		unique: true,
	};
	if (guild.systemChannel) {
		channelId = guild.systemChannel.id;
	} else {
		channelId = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).first()?.id ?? '';
	}

	const inviteLink = (await guild.invites.create(channelId, inviteOptions)).url;
	const embed = createEmbed(
		`${guild.members.me?.user.username ?? 'BOT'}`,
		`You did not fill the form correctly(like we said it is automated and you got kicked from the server).\n\nPlease Consider refilling [this form](${formLink})\n\nusing this username : \`${member.user.tag}\` in the Discord Username Field.\nAfter refiling the form you can rejoin the server without getting kicked using [this link](${inviteLink})\n\nThanks for your Understanding.`,
	);
	await member.send({
		embeds: [embed],
	});
	await member.kick();
}
