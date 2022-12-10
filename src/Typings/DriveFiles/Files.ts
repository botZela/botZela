import { drive_v3 } from '@googleapis/drive';

export interface DriveFileInterface extends drive_v3.Schema$File {
	name: string;
	id: string;
	resourceKey?: string;
}
