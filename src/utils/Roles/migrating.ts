import { type Guild } from 'discord.js';
import yaml from 'js-yaml';
import gRoles from '../../Models/guildRoles.js';
import { zRoleType, type RoleType } from '../../Typings/migrateRole/index.js';

export function convertYaml2RoleType(message: string): RoleType[] | 0 {
	try {
		const out = yaml.load(message) as RoleType[];
		if (Array.isArray(out)) {
			for (const elem of out) {
				if (!zRoleType.safeParse(elem).success) {
					console.log('[ERROR] Structure is Not Valide.');
					return 0;
				}
			}

			return out;
		}

		return 0;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

export async function migrateRole(guild: Guild, role_input: RoleType[]) {
	try {
		const guildData = await gRoles.findOne({ guildId: guild.id });
		if (!guildData) {
			return [];
		}

		const guildRoles = guildData.roles;

		for (const member of role_input) {
			const realMember = guild.members.cache.get(member.id);
			if (realMember !== undefined) {
				const { add_roles, remove_roles } = member;
				const addRoles = add_roles
					.split(',')
					.filter((ee) => ee.length !== 0)
					.map((ee) => ee.trim())
					.map((role_name) => guildRoles.get(role_name))
					.filter((role) => role !== undefined) as string[];
				const removeRoles = remove_roles
					.split(',')
					.filter((ee) => ee.length !== 0)
					.map((ee) => ee.trim())
					.map((role_name) => guildRoles.get(role_name))
					.filter((role) => role !== undefined) as string[];

				await realMember.roles.remove(removeRoles);
				await realMember.roles.add(addRoles);
			}
		}
	} catch (error) {
		console.error(error);
	}
}
