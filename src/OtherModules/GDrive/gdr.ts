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

export async function driveSearchRec(driveId: string, path: string[]) {
	try {
		const res = await drive.files.list({
			q: `'${driveId}' in parents`,
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
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

export async function getParent(id: string) {
	try {
		const result = await drive.files.get({
			fileId: id,
			fields: 'parents',
		});
		console.log(result.data);
		return (result.data as string[])[0];
	} catch (error) {
		console.log(error);
	}
}

export async function driveSearch(driveId: string) {
	try {
		const res = await drive.files.list({
			q: `'${driveId}' in parents`,
			fields: 'files(id, name, mimeType, parents)', // application/vnd.google-apps.folder
			spaces: 'drive',
		});
		return res.data.files;
	} catch (error) {
		console.log(error);
	}
}

export async function generatePublicUrl(
	id: string,
): Promise<{ webViewLink?: string | null; webContentLink?: string | null }> {
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

// path = 'S1/M1.1.1 Algorithmique_Programmation/Exams'.split('/');
// driveId = driveSearch('1YxhLTBKOtj_hcjWa8ZYslGg88JJUiwBD', path);
