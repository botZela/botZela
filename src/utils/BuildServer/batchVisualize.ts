import { batchCreateVisualization } from './batchCreateVisualization';
import { dictToList } from './dictToList';
import { structureSort } from './structureSort';
import { StructureType } from '../../Typings/buildServer';

export function batchVisualize(channelFormat: StructureType[]): string {
	const dictFormat = dictToList(channelFormat);
	structureSort(dictFormat);
	const visualization = batchCreateVisualization(dictFormat);
	return visualization;
}
