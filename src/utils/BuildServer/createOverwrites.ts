import type { Guild, OverwriteResolvable } from 'discord.js';
import gRoles from '../../Models/guildRoles.js';
import { client } from '../../index.js';
import { logsEmbed } from '../Logger/index.js';

export async function createOverwrites(
	guild: Guild,
	rolesList: string[],
	createRole: boolean,
): Promise<OverwriteResolvable[]> {
	const guildData = await gRoles.findOne({ guildId: guild.id });
	if (!guildData) {
		return [];
	}

	const guildRoles = guildData.roles;
	const overwrites: OverwriteResolvable[] = [
		{
			id: guild.roles.everyone.id,
			deny: ['ViewChannel'],
		},
	];
	if (client.user) {
		overwrites.push({
			id: client.user.id,
			allow: ['ViewChannel'],
		});
	}

	for (const role of rolesList) {
		const roleId = guildRoles.get(role);
		if (roleId) {
			overwrites.push({
				id: roleId,
				allow: ['ViewChannel'],
			});
		} else if (createRole) {
			const new_role = await guild.roles.create({ name: role });
			overwrites.push({
				id: new_role.id,
				allow: ['ViewChannel'],
			});
		} else {
			await logsEmbed(`Role "${role}" was not found in guild ${guild.name}`, guild, 'warn');
		}
	}

	return overwrites;
}
