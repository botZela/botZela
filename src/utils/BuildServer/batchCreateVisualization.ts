import type { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function batchCreateVisualization(listFormat: StructureListType[], prefix_arg = ''): string {
	const middlePrefix = `${prefix_arg}├── `;
	const lastPrefix = `${prefix_arg}└── `;
	const parentsPrefix = `${prefix_arg}│    `;
	const newLine = '\n';
	let output = '';
	let len = listFormat.length - 1;
	for (const element of listFormat) {
		let branchPrefix: string;
		let prefix: string;
		if (len === 0) {
			branchPrefix = lastPrefix;
			prefix = '     ';
		} else {
			branchPrefix = middlePrefix;
			prefix = parentsPrefix;
		}

		if (element[1] === 'category') {
			output += newLine + branchPrefix + element[0];
			try {
				output += batchCreateVisualization(element[2]!, prefix);
			} catch (err) {
				console.error(err);
			}
		} else if (element[2] === 'forum') {
			output += newLine + branchPrefix + '💭' + element[0];
			output +=
				element[3]
					?.map((tag, index, tags) => {
						if (index === tags.length - 1) {
							return newLine + prefix + '└── 🏷️  ' + tag;
						} else {
							return newLine + prefix + '├── 🏷️  ' + tag;
						}
					})
					.join('') ?? '';
		} else if (['voice'].includes((element as ChannelListType)[2])) {
			output += `${newLine + branchPrefix}🔊 ${element[0]}`;
		} else if (['stage'].includes((element as ChannelListType)[2])) {
			output += `${newLine + branchPrefix}🎙️ ${element[0]}`;
		} else {
			output += `${newLine + branchPrefix}#️⃣ ${element[0]}`;
		}

		len -= 1;
	}

	return output;
}
