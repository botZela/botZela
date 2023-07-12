/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs_sync from 'node:fs';
import fs from 'node:fs/promises';
import axios from 'axios';
import cheerio from 'cheerio';

const dir = './data/downloads/Articles';

async function getFilesizeInMegaBytes(filename: fs_sync.PathLike): Promise<number> {
	const stats = await fs.stat(filename);
	const fileSizeInBytes = stats.size;
	return fileSizeInBytes / 2 ** 20;
}

async function downloadPDF(pdfURL: string | undefined, outputFilename: fs_sync.PathLike): Promise<unknown> {
	const pdfBuffer = (
		await axios({
			method: 'GET',
			url: pdfURL,
			responseType: 'stream',
		})
	).data;

	// Create Folder if it does not exist
	try {
		await fs.access(dir);
	} catch {
		await fs.mkdir(dir, { recursive: true });
	}

	// Write the stream(the pdf) to a file
	pdfBuffer.pipe(fs_sync.createWriteStream(outputFilename));

	return new Promise((resolve, reject) => {
		pdfBuffer.on('end', resolve);
		pdfBuffer.on('error', reject);
	});
}

export async function getArticle(doi: string): Promise<string | 0 | 1 | undefined> {
	try {
		const baseUrl = 'https://sci-hub.hkvisa.net';
		const htmlData = (await axios.get(`${baseUrl}/${doi}`)).data as string;
		const $ = cheerio.load(htmlData);
		const srcPdf = $('#article iframe')
			.attr('src')
			?.replace('#navpanes=0&view=FitH', '')
			?.replace('#view=FitH', '')
			?.replace('#navpanes=0', '');
		if (!srcPdf) {
			return 0;
		}

		let url;
		if (srcPdf.startsWith('https://')) {
			url = srcPdf;
		} else if (srcPdf[1] === '/') {
			url = `https:${srcPdf}`;
		} else {
			url = `${baseUrl}${srcPdf}`;
		}

		console.log(`[INFO] ${url}`);
		// URL of the PDF
		const article = url.split('/').at(-1);
		// Path at which PDF will get downloaded
		if (!article) return 0;
		const filePath = `${dir}/${article}`;
		await downloadPDF(url, filePath);
		if ((await getFilesizeInMegaBytes(filePath)) > 8) {
			throw new Error('SizeLimit');
		}

		return article;
	} catch (error) {
		console.log(error);
		if (error instanceof Error && error.message === 'SizeLimit') {
			return 1;
		}

		return 0;
	}
}
