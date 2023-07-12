import type { drive_v3 } from '@googleapis/drive';

export interface DriveFileInterface extends drive_v3.Schema$File {
	id: string;
	name: string;
	resourceKey?: string;
}
