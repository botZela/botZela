import type { StructureType } from '../../Typings/buildServer';
import { batchCreateVisualization } from './batchCreateVisualization.js';
import { dictToList } from './dictToList.js';
import { structureSort } from './structureSort.js';

export function batchVisualize(channelFormat: StructureType[]): string {
	const dictFormat = dictToList(channelFormat);
	structureSort(dictFormat);
	return batchCreateVisualization(dictFormat);
}
