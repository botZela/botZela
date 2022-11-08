import { drive as GoogleDrive, drive_v3 } from '@googleapis/drive';
import { GoogleAuth } from 'googleapis-common';
import { DriveFileInterface } from '../../Typings';

const authFile = `${process.cwd()}/credentials/google_account.json`;
const auth = new GoogleAuth({
	keyFile: authFile,
	scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = GoogleDrive({
	version: 'v3',
	auth: auth,
} as unknown as drive_v3.Options);

export async function checkDriveId(folder: DriveFileInterface): Promise<boolean> {
	try {
		const result = await drive.files.get(
			{
				fileId: folder.id,
				fields: 'shared',
			},
			{
				headers: {
					'X-Goog-Drive-Resource-Keys': folder.resourceKey ? `${folder.id}/${folder.resourceKey}` : '',
				},
			},
		);
		if (result.data.shared) return result.data.shared;
		return false;
	} catch (error) {
		return false;
	}
}

export async function getDriveName(folder: DriveFileInterface): Promise<string> {
	try {
		const result = await drive.files.get(
			{
				fileId: folder.id,
				fields: 'name',
			},
			{
				headers: {
					'X-Goog-Drive-Resource-Keys': folder.resourceKey ? `${folder.id}/${folder.resourceKey}` : '',
				},
			},
		);
		if (result.data.name) return result.data.name;
		return 'Folder';
	} catch (error) {
		return '';
	}
}

export async function driveSearch(folder: DriveFileInterface) {
	try {
		const res = await drive.files.list(
			{
				q: `'${folder.id}' in parents`,
				pageSize: 1000,
				orderBy: 'folder, name',
				fields: 'files(id, name, mimeType, shortcutDetails, resourceKey)',
				spaces: 'drive',
			},
			{
				headers: {
					'X-Goog-Drive-Resource-Keys': folder.resourceKey ? `${folder.id}/${folder.resourceKey}` : '',
				},
			},
		);
		return res.data.files;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function driveSearchName(folder: DriveFileInterface, fileName: string) {
	try {
		const res = await drive.files.list(
			{
				q: `'${folder.id}' in parents and name contains '${fileName}'`,
				pageSize: 1000,
				orderBy: 'folder, name',
				fields: 'files(id, name, mimeType, shortcutDetails, resourceKey)',
				spaces: 'drive',
			},
			{
				headers: {
					'X-Goog-Drive-Resource-Keys': folder.resourceKey ? `${folder.id}/${folder.resourceKey}` : '',
				},
			},
		);
		return res.data.files;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function givePermissionsToAnyone(fileId: string) {
	await drive.permissions.create({
		fileId: fileId,
		requestBody: {
			role: 'reader',
			type: 'anyone',
		},
	});
}

export async function getFile(
	file: DriveFileInterface,
	fields: (keyof drive_v3.Schema$File)[],
): Promise<drive_v3.Schema$File> {
	try {
		const result = await drive.files.get(
			{
				fileId: file.id,
				fields: fields.join(','),
			},
			{
				headers: {
					'X-Goog-Drive-Resource-Keys': file.resourceKey ? `${file.id}/${file.resourceKey}` : '',
				},
			},
		);
		return result.data;
	} catch (error) {
		console.log(error);
		return {};
	}
}

export async function generatePublicUrl(folder: DriveFileInterface): Promise<drive_v3.Schema$File> {
	return getFile(folder, ['webViewLink', 'webContentLink']);
}

export function getIdResourceKey(url: string) {
	const regExResults = /\/drive\/(u\/0\/)?folders\/([a-zA-Z0-9-_]+)(\?resourcekey=([a-zA-Z0-9-_]+))?/.exec(url);
	if (regExResults === null) return null;
	return { id: regExResults[2], resourceKey: regExResults[4] };
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
