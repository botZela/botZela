import type { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function structureSort(structure: StructureListType[]) {
	let temp;
	const len = structure.length;
	for (let ii = 0; ii < len; ii++) {
		if (structure[ii][1] === 'category') {
			try {
				structureSort(structure[ii][2] as ChannelListType[]);
			} catch {}
		}

		for (let ss = 0; ss < len; ss++) {
			for (let jj = 0; jj < len - ss - 1; jj++) {
				if (structure[jj][1] === 'category' && structure[jj + 1][1] === 'channel') {
					temp = structure[jj];
					structure[jj] = structure[jj + 1];
					structure[jj + 1] = temp;
				} else if (
					structure[jj][1].toLowerCase() === 'channel' &&
					structure[jj + 1][1].toLowerCase() === 'channel' &&
					structure[jj][2]
				) {
					if (structure[jj + 1][2]) {
						if (
							((structure[jj][2] === 'voice' || structure[jj][2] === 'stage') &&
								(structure[jj + 1][2] === 'text' || structure[jj + 1][2] === 'forum')) ||
							(structure[jj][2] === 'text' && structure[jj + 1][2] === 'forum') ||
							(structure[jj][2] === 'voice' && structure[jj + 1][2] === 'stage')
						) {
							temp = structure[jj];
							structure[jj] = structure[jj + 1];
							structure[jj + 1] = temp;
						}
					} else {
						temp = structure[jj];
						structure[jj] = structure[jj + 1];
						structure[jj + 1] = temp;
					}
				}
			}
		}
	}
}
