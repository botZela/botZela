import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import linksModel from '../../../../Models/guildLinks';
import guildRoles from '../../../../Models/guildRoles';
import { GSpreadSheet } from '../../../../OtherModules/GSpreadSheet';
import { Person } from '../../../../OtherModules/Member';
import { ICommand } from '../../../../Typings';
import { client } from '../../../../index';
import { createErrorEmbed, createInfoEmbed } from '../../../../utils';
import { downgradeRoles, resetRoles, updateRole } from '../../../../utils/Roles';

const defaultExport: ICommand = {
	name: 'roles',
	description: 'Update or Reset the roles for a member or everyone ( if the member is not specified)',
	options: [
		{
			name: 'reset',
			description: 'Set the roles from the spreadsheet',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'member',
					description: 'The member you want to reset',
					type: ApplicationCommandOptionType.User,
					required: false,
				},
			],
		},
		{
			name: 'upgrade',
			description: 'Upgrade Roles for everyone in the server (1A -> 2A, 2A -> 3A, 3A -> Laureate).',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'member',
					description: 'The member you want to upgrade',
					type: ApplicationCommandOptionType.User,
					required: false,
				},
			],
		},
		{
			name: 'downgrade',
			description: `Downgrade Roles for everyone in the server (2A -> 1A, 3A -> 2A, Laureate(${new Date().getFullYear()}) -> 3A).`,
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'member',
					description: 'The member you want to Downgrade',
					type: ApplicationCommandOptionType.User,
					required: false,
				},
			],
		},
	],
	dmPermission: false,
	guilds: [client.testGuilds.find((guild) => guild.name.includes('ENSIAS'))?.id ?? ''],
	async execute({ interaction }) {
		if (!interaction.guild) return;
		await interaction.deferReply({ ephemeral: true });
		const target = interaction.options.getMember('member') as GuildMember | null;
		const subCommand = interaction.options.getSubcommand();
		if (subCommand === 'reset') {
			const worksheetUrl = (await linksModel.findOne({ guildId: interaction.guildId }))?.spreadsheet;
			if (!worksheetUrl)
				return interaction.followUp({
					embeds: [createErrorEmbed("Couldn't find the spreadsheeat link")],
					ephemeral: true,
				});
			const gAccPath = `${process.cwd()}/credentials/google_account.json`;
			const activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
			if (target) {
				let index = await activeSheet.findCellCol(`${target.user.tag}`, 'F');
				if (index === 0) {
					index = await activeSheet.findCellCol(`${target.user.id}`, 'G');
					if (index === 0) {
						return;
					}
					await activeSheet.updateCell(`F${index}`, `${target.user.tag}`);
				}
				await activeSheet.updateCell(`G${index}`, `${target.id}`);

				const newMem = await Person.create(index, interaction.guild, activeSheet);
				await resetRoles(target, [newMem], 0);
			} else {
				const userArray = await Person.getAll(interaction.guild, activeSheet);
				await Promise.all(
					(await interaction.guild.members.fetch()).map((user) => resetRoles(user, userArray.slice(1))),
				);
			}
			await interaction.followUp({
				content: `Congratulations for our new laureats of year ${new Date().getFullYear()} `,
				ephemeral: true,
			});
		} else if (subCommand === 'upgrade') {
			const guildData = await guildRoles.findOne({ guildId: interaction.guildId });
			if (!guildData) return;

			const roles = guildData.roles;
			const promo = new Date().getFullYear().toString();
			let rolePromoId = roles.get(promo);
			if (!rolePromoId) {
				rolePromoId = (
					await interaction.guild.roles.create({
						name: promo,
					})
				).id;
			}

			let msg = '';
			if (target) {
				await updateRole(target);
				msg = `<@${target.id}> Passed to the **Next Year**`;
			} else {
				await Promise.all((await interaction.guild.members.fetch()).map((user) => updateRole(user)));
				msg = `Everyone on the server Passed to the **Next Year**`;
			}
			await interaction.followUp({
				embeds: [createInfoEmbed(`Role Downgrade`, msg)],
				ephemeral: true,
			});
		} else if (subCommand === 'downgrade') {
			let msg = '';
			if (target) {
				await downgradeRoles(target);
				msg = `<@${target.id}> Got **Downgraded**`;
			} else {
				await Promise.all((await interaction.guild.members.fetch()).map((user) => downgradeRoles(user)));
				msg = `Everyone on the server Got **Downgraded**`;
			}
			await interaction.followUp({
				embeds: [createInfoEmbed(`Role Downgrade`, msg)],
				ephemeral: true,
			});
		}
	},
};

export default defaultExport;
