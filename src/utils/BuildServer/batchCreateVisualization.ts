import { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function batchCreateVisualization(listFormat: StructureListType[], prefix = ''): string {
	const middlePrefix = prefix + '├── ';
	const lastPrefix = prefix + '└── ';
	const parentsPrefix = prefix + '│    ';
	const newLine = '\n';
	let output = '';
	let n = listFormat.length - 1;
	for (let element of listFormat) {
		let branchPrefix, prefix;
		if (n != 0) {
			branchPrefix = middlePrefix;
			prefix = parentsPrefix;
		} else {
			branchPrefix = lastPrefix;
			prefix = '     ';
		}
		if (element[1] === 'category') {
			output += newLine + branchPrefix + element[0];
			try {
				output += batchCreateVisualization(element[2] as ChannelListType[], prefix);
			} catch (e) {
				null;
			}
		} else if (element[1] === 'channel') {
			if (['voice', 'stage'].includes((element as ChannelListType)[2]))
				output += newLine + branchPrefix + '🔊 ' + element[0];
			else output += newLine + branchPrefix + '# ' + element[0];
		}
		n -= 1;
	}
	return output;
}
