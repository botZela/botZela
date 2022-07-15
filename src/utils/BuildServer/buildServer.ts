import { Message } from 'discord.js';
import { batchCreate } from './batchCreate';
import { batchVisualize } from './batchVisualize';
import { convertYaml } from './convertYaml';
import { ExtendedCommandInteraction } from '../../Typings';
import { createEmbed } from '../Embeds';

export async function buildServer(message: Message | ExtendedCommandInteraction): Promise<void> {
	if (!message.channel || !message.guild) {
		await message.reply("Can't do this");
		return;
	}
	console.log(`[INFO] Building ${message.guild.name} Server `);
	const structure = `- category: 
        - categoryName,role1,role2
        - channels :
            - channel : channelName1,voice
            - channel : channelName2,text,role1
            - channel : channelName3,voice
            - channel : channelName4,stage`;
	const filter = (m: Message) => m.member?.id === message.member?.id;
	// eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
	while (true) {
		const embed = createEmbed(
			'Please enter your server structure.\n**Example :**',
			`\`\`\`${structure}\`\`\`\n**Cancel**: to stop the command.`,
		);
		await message.channel.send({ embeds: [embed] });
		try {
			const collected = await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] });
			const msg = collected.first()?.content;
			if (msg === undefined) {
				continue;
			}
			if (msg.toLowerCase() === 'cancel') {
				console.log(`[INFO] Build Server command was canceled in server ${message.guild.name}`);
				const embed = createEmbed('Build Server command was canceled');
				await message.channel.send({ embeds: [embed] });
				break;
			}
			const channelFormat = convertYaml(msg);
			console.log('[INFO] Structure given');
			console.log(`------\n${msg}\n------`);
			if (!channelFormat) {
				console.log('[INFO] Bad structure given !!');
				const embed = createEmbed('Bad structure given !!');
				await message.channel.send({ embeds: [embed] });
				continue;
			}
			const visualization = batchVisualize(channelFormat);
			let embed = createEmbed(
				'Build Visualization',
				`Please confim your structure: \n\`\`\` ${visualization}\`\`\`\n ** YES / NO ** `,
			);
			await message.channel.send({ embeds: [embed] });
			console.log(`[INFO] Structure of ${message.guild.name} Server \n------\n${visualization}\n------`);
			try {
				const collected = await message.channel.awaitMessages({
					filter: filter,
					max: 1,
					time: 60000,
					errors: ['time'],
				});

				if (collected.first()?.content.toLowerCase() === 'yes') {
					await batchCreate(message.guild, channelFormat);
					embed = createEmbed('Sructure Created Succesfully');
					await message.channel.send({ embeds: [embed] });
					console.log(`[INFO] ${message.guild.name} Server structure was created successfully`);
					break;
				}
			} catch (e) {
				embed = createEmbed('Bot timed Out!!!');
				await message.channel.send({ embeds: [embed] });
				console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
				break;
			}
		} catch (e) {
			const embed = createEmbed('Bot timed Out!!!');
			await message.channel.send({ embeds: [embed] });
			console.log(`[INFO] Bot timed out in server ${message.guild.name}`);
			return;
		}
	}
}
