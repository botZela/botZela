import yaml from 'js-yaml';
import { StructureType, zStructureType } from '../../Typings/buildServer';

export function convertYaml(message: string): StructureType[] | 0 {
	try {
		const out = yaml.load(message) as StructureType[];
		if (Array.isArray(out)) {
			for (const e of out) {
				if (!zStructureType.safeParse(e).success) {
					console.log('[ERROR] Structure is Not Valide.');
					return 0;
				}
			}
			return out;
		}
		return 0;
	} catch (e) {
		console.log(e);
		return 0;
	}
}
