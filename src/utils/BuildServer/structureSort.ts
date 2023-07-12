import type { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function structureSort(tab: StructureListType[]) {
	let temp;
	const len = tab.length;
	for (let ii = 0; ii < len; ii++) {
		if (tab[ii][1] === 'category') {
			try {
				structureSort(tab[ii][2] as ChannelListType[]);
			} catch {}
		}

		for (let ss = 0; ss < len; ss++) {
			for (let jj = 0; jj < len - ss - 1; jj++) {
				if (tab[jj][1] === 'category' && tab[jj + 1][1] === 'channel') {
					temp = tab[jj];
					tab[jj] = tab[jj + 1];
					tab[jj + 1] = temp;
				} else if (tab[jj][1].toLowerCase() === 'channel' && tab[jj + 1][1].toLowerCase() === 'channel' && tab[jj][2]) {
					if (tab[jj + 1][2]) {
						if ((tab[jj][2] === 'voice' || tab[jj][2] === 'stage') && tab[jj + 1][2] === 'text') {
							temp = tab[jj];
							tab[jj] = tab[jj + 1];
							tab[jj + 1] = temp;
						}
					} else {
						temp = tab[jj];
						tab[jj] = tab[jj + 1];
						tab[jj + 1] = temp;
					}
				}
			}
		}
	}
}
