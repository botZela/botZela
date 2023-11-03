import type { StructureType } from '../../Typings/buildServer';
import { batchCreateVisualization } from './batchCreateVisualization';
import { dictToList } from './dictToList';
import { structureSort } from './structureSort';

export function batchVisualize(channelFormat: StructureType[]): string {
	const dictFormat = dictToList(channelFormat);
	structureSort(dictFormat);
	return batchCreateVisualization(dictFormat);
}
