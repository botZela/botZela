import type { GuildMember, RoleResolvable } from 'discord.js';

export async function giveRoles(member: GuildMember, roleOrRoles: RoleResolvable | RoleResolvable[]) {
	await member.roles.add(roleOrRoles);
}
