import { Guild, OverwriteResolvable } from 'discord.js';
import { client } from '../..';
import gRoles from '../../Models/guildRoles';
import { logsMessage } from '../logsMessage';

export async function createOverwrites(guild: Guild, rolesList: string[]): Promise<OverwriteResolvable[]> {
	if (!rolesList) return [];
	const guildData = await gRoles.findOne({ guildId: guild.id });
	if (!guildData) {
		return [];
	}
	const guildRoles = guildData.roles;
	const overwrites: OverwriteResolvable[] = [
		{
			id: guild.roles.everyone.id,
			deny: ['VIEW_CHANNEL'],
		},
	];
	if (client.user) {
		overwrites.push({
			id: client.user.id,
			allow: ['VIEW_CHANNEL'],
		});
	}

	for (const role of rolesList) {
		let roleId = guildRoles.get(role);
		if (roleId) {
			overwrites.push({
				id: roleId,
				allow: ['VIEW_CHANNEL'],
			});
		} else {
			logsMessage(`[ERROR] Role ${role} was not found for guild ${guild.name}`, guild);
		}
	}
	return overwrites;
}
