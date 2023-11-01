import type { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function batchCreateVisualization(listFormat: StructureListType[], prefix = ''): string {
	const middlePrefix = `${prefix}├── `;
	const lastPrefix = `${prefix}└── `;
	const parentsPrefix = `${prefix}│    `;
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
			} catch {}
		} else if (['voice'].includes((element as ChannelListType)[2])) {
			output += `${newLine + branchPrefix}🔊 ${element[0]}`;
		} else if (['stage'].includes((element as ChannelListType)[2])) {
			output += `${newLine + branchPrefix}🎙️ ${element[0]}`;
		} else if (['forum'].includes((element as ChannelListType)[2])) {
			output += `${newLine + branchPrefix}💭 ${element[0]}`;
		} else {
			output += `${newLine + branchPrefix}#️⃣ ${element[0]}`;
		}

		len -= 1;
	}

	return output;
}
