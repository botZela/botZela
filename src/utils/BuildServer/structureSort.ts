import { ChannelListType, StructureListType } from '../../Typings/buildServer';

export function structureSort(tab: StructureListType[]) {
	let n, temp;
	n = tab.length;
	for (let i = 0; i < n; i++) {
		if (tab[i][1] == 'category') {
			try {
				structureSort(tab[i][2] as ChannelListType[]);
			} catch (e) {
				null;
			}
		}
		for (let s = 0; s < n; s++) {
			for (let j = 0; j < n - s - 1; j++) {
				if (tab[j][1] === 'category' && tab[j + 1][1] === 'channel') {
					temp = tab[j];
					tab[j] = tab[j + 1];
					tab[j + 1] = temp;
				} else if (tab[j][1].toLowerCase() === 'channel' && tab[j + 1][1].toLowerCase() === 'channel') {
					if (tab[j][2]) {
						if (tab[j + 1][2]) {
							if ((tab[j][2] == 'voice' || tab[j][2] == 'stage') && tab[j + 1][2] == 'text') {
								temp = tab[j];
								tab[j] = tab[j + 1];
								tab[j + 1] = temp;
							}
						} else {
							temp = tab[j];
							tab[j] = tab[j + 1];
							tab[j + 1] = temp;
						}
					}
				}
			}
		}
	}
}
