import { createEmbed } from '../../utils/createEmbed';
import linksModel from '../../Models/guildLinks';
import { Guild, GuildMember } from 'discord.js';

export async function kick(member: GuildMember, guild: Guild) {
	let formLink, inviteLink;
	const linksData = await linksModel.findOne({ guildId: guild.id });
	if (linksData) {
		formLink = linksData?.form || '';
	}
	if (guild.systemChannel) {
		const inviteOptions = {
			maxAge: 30 * 60,
			maxUses: 1,
			unique: true,
		};
		inviteLink = (await guild.invites.create(guild.systemChannel.id, inviteOptions)).url;
	}
	let embed = createEmbed(
		`${guild.me?.user.username}`,
		`You did not fill the form correctly(like we said it is automated and you got kicked from the server).\n\nPlease Consider refilling [this form](${formLink})\n\nusing this username : \`${member.user.tag}\` in the Discord Username Field.\nAfter refiling the form you can rejoin the server without getting kicked using [this link](${inviteLink})\n\n\Thanks for your Understanding.`,
	);
	await member.send({
		embeds: [embed],
	});
	await member.kick();
}
