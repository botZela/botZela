/* eslint-disable id-length */
import process from 'node:process';
import type { drive_v3 } from '@googleapis/drive';
import { drive as GoogleDrive } from '@googleapis/drive';
import { GoogleAuth } from 'googleapis-common';
import type { DriveFileInterface } from '../../Typings';

const auth = new GoogleAuth({
	credentials: {
		client_email: process.env.GOOGLE_CLIENT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	},
	scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = GoogleDrive({
	version: 'v3',
	auth,
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
	} catch {
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
	} catch {
		return '';
	}
}

export async function driveSearch(folder: DriveFileInterface) {
	try {
		const res = await drive.files.list(
			{
				q: `'${folder.id}' in parents`,
				pageSize: 1_000,
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
				pageSize: 1_000,
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
		fileId,
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

function getQueryParam(param: string, url: string) {
	const rx = new RegExp(`[?&]${param}=([^&]+).*`);
	const returnVal = url.match(rx);
	return returnVal === null ? undefined : decodeURIComponent(returnVal[1].replaceAll('+', ' '));
}

export function getIdResourceKey(url: string) {
	// eslint-disable-next-line unicorn/no-unsafe-regex
	const regExResults = /\/drive\/(?<u>\/0\/)?folders\/(?<id>[\w-]+)(?<a>\?resourcekey=(?<resourcekey>[\w-]+))?/.exec(
		url,
	);
	if (regExResults === null) return null;
	return {
		id: regExResults[2],
		resourceKey: getQueryParam('resourcekey', url),
	};
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
			if (res.data.files)
				for (const file of res.data.files) {
					if (file.name === key) {
						console.log('found', file.name);

						if (file.id) await driveSearchRec(file.id, path);
					}
				}
		} else {
			return driveId;
		}
	} catch (error) {
		console.log(error);
	}
}
