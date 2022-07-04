import { StructureType } from '../../Typings/buildServer';
import { batchCreateVisualization } from './batchCreateVisualization';
import { dictToList } from './dictToList';
import { structureSort } from './structureSort';

export function batchVisualize(channelFormat: StructureType[]): string {
	let dictFormat = dictToList(channelFormat);
	structureSort(dictFormat);
	let visualization = batchCreateVisualization(dictFormat);
	return visualization;
}
