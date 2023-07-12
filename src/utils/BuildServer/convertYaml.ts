import yaml from 'js-yaml';
import type { StructureType } from '../../Typings/buildServer';
import { zStructureType } from '../../Typings/buildServer/index.js';

export function convertYaml(message: string): StructureType[] | 0 {
	try {
		const out = yaml.load(message) as StructureType[];
		if (Array.isArray(out)) {
			for (const elem of out) {
				if (!zStructureType.safeParse(elem).success) {
					console.log('[ERROR] Structure is Not Valide.');
					return 0;
				}
			}

			return out;
		}

		return 0;
	} catch (error) {
		console.log(error);
		return 0;
	}
}
