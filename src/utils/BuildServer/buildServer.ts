import type { Message } from 'discord.js';
import type { ExtendedCommandInteraction } from '../../Typings';
import { createEmbed, createErrorEmbed, createInfoEmbed } from '../Embeds';
import { batchCreate } from './batchCreate';
import { batchVisualize } from './batchVisualize';
import { convertYaml } from './convertYaml';

export async function buildServer(interaction: ExtendedCommandInteraction): Promise<void> {
	if (!interaction.channel || !interaction.guild) {
		await interaction.reply("Can't do this");
		return;
	}

	console.log(`[INFO] Building ${interaction.guild.name} Server `);
	const structure = `- category: 
	- categoryName,role1,role2
	- channels :
		- channel : channelName1,voice
		- channel : channelName2,text,role1
		- channel : channelName3,voice
		- channel : channelName4,stage
		- forum : 
			- channelName2, role1
			- tags: 
				- tag1,🏷️
				- tag2`;
	const filter = (msg: Message) => msg.member?.id === interaction.member.id;
	// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
	while (true) {
		const embed = createEmbed('', `\`\`\`${structure}\`\`\`\n**Cancel**: to stop the command.`);
		await interaction.channel.send({
			embeds: [embed],
		});
		try {
			const collected = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				time: 60_000,
				errors: ['time'],
			});
			const msg = collected.first()?.content;
			if (msg === undefined) {
				continue;
			}

			if (msg.toLowerCase() === 'cancel') {
				console.log(`[INFO] Build Server command was canceled in server ${interaction.guild.name}`);
				const embed = createErrorEmbed('Build Server command was canceled');
				await interaction.channel.send({
					embeds: [embed],
				});
				break;
			}

			const channelFormat = convertYaml(msg);
			console.log('[INFO] Structure given');
			console.log(`------\n${msg}\n------`);
			if (!channelFormat) {
				console.log('[INFO] Bad structure given !!');
				const embed = createErrorEmbed('Bad structure given !!');
				await interaction.channel.send({
					embeds: [embed],
				});
				continue;
			}

			const visualization = batchVisualize(channelFormat);
			let embed = createEmbed(
				'Build Visualization',
				`Please confim your structure: \n\`\`\` ${visualization}\`\`\`\n ** YES / NO ** `,
			);
			await interaction.channel.send({
				embeds: [embed],
			});
			console.log(`[INFO] Structure of ${interaction.guild.name} Server \n------\n${visualization}\n------`);
			try {
				const collected = await interaction.channel.awaitMessages({
					filter,
					max: 1,
					time: 60_000,
					errors: ['time'],
				});

				if (collected.first()?.content.toLowerCase() === 'yes') {
					await batchCreate(interaction.guild, channelFormat);
					embed = createInfoEmbed('Sructure Created Succesfully');
					await interaction.channel.send({
						embeds: [embed],
					});
					console.log(`[INFO] ${interaction.guild.name} Server structure was created successfully`);
					break;
				}
			} catch {
				embed = createErrorEmbed('Bot timed Out!!!');
				await interaction.channel.send({
					embeds: [embed],
				});
				console.log(`[INFO] Bot timed out in server ${interaction.guild.name}`);
				break;
			}
		} catch {
			const embed = createErrorEmbed('Bot timed Out!!!');
			await interaction.channel.send({
				embeds: [embed],
			});
			console.log(`[INFO] Bot timed out in server ${interaction.guild.name}`);
			return;
		}
	}
}
