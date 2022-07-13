import { drive as GoogleDrive, drive_v3 } from '@googleapis/drive';
import { GoogleAuth } from 'googleapis-common';

const authFile = `${process.cwd()}/credentials/google_account.json`;
const auth = new GoogleAuth({
	keyFile: authFile,
	scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
});
const drive = GoogleDrive({
	version: 'v3',
	auth: auth,
} as unknown as drive_v3.Options);

export async function checkDriveId(driveId: string): Promise<boolean> {
	try {
		const result = await drive.files.get({
			fileId: driveId,
			fields: 'shared',
		});
		if (result.data.shared) return result.data.shared;
		return false;
	} catch (error) {
		return false;
	}
}

export async function getDriveName(driveId: string): Promise<string> {
	try {
		const result = await drive.files.get({
			fileId: driveId,
			fields: 'name',
		});
		if (result.data.name) return result.data.name;
		return 'Folder';
	} catch (error) {
		return '';
	}
}

export async function driveSearchRec(driveId: string, path: string[]) {
	try {
		const res = await drive.files.list({
			q: `'${driveId}' in parents`,
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
			pageSize: 25,
		});
		const key = path.shift();
		if (key) {
			res.data.files?.forEach((file) => {
				if (file.name === key && key) {
					console.log('found', file.name);

					if (file.id) driveSearchRec(file.id, path).catch(console.error);
				}
			});
		} else {
			return driveId;
		}
	} catch (error) {
		console.log(error);
	}
}

export async function driveSearch(driveId: string) {
	try {
		const res = await drive.files.list({
			q: `'${driveId}' in parents`,
			pageSize: 1000,
			orderBy: 'folder, name',
			fields: 'files(id, name, mimeType, shortcutDetails)',
			spaces: 'drive',
		});
		return res.data.files;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function generatePublicUrl(id: string): Promise<drive_v3.Schema$File> {
	try {
		const result = await drive.files.get({
			fileId: id,
			fields: 'webViewLink, webContentLink',
		});
		return result.data;
	} catch (error) {
		console.log(error);
		return {};
	}
}
