import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const dir = './data/downloads/Articles';

function getFilesizeInMegaBytes(filename: fs.PathLike): number {
	let stats = fs.statSync(filename);
	let fileSizeInBytes = stats.size;
	return fileSizeInBytes / 2 ** 20;
}

async function downloadPDF(pdfURL: string | undefined, outputFilename: fs.PathLike): Promise<unknown> {
	let pdfBuffer = (
		await axios({
			method: 'GET',
			url: pdfURL,
			responseType: 'stream',
		})
	).data;

	// Create Folder if it does not exist
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	// Write the stream(the pdf) to a file
	pdfBuffer.pipe(fs.createWriteStream(outputFilename));

	return new Promise((resolve, reject) => {
		pdfBuffer.on('end', resolve);
		pdfBuffer.on('error', reject);
	});
}

export async function getArticle(doi: string): Promise<string | 1 | 0 | undefined> {
	try {
		const baseUrl = 'https://sci-hub.hkvisa.net';
		const htmlData = (await axios.get(`${baseUrl}/${doi}`)).data;
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
		} else if (srcPdf[1] !== '/') {
			url = `${baseUrl}${srcPdf}`;
		} else {
			url = `https:${srcPdf}`;
		}
		console.log(`[INFO] ${url}`);
		// URL of the PDF
		const article = url.split('/').at(-1);
		// Path at which PDF will get downloaded
		const filePath = `${dir}/${article}`;
		await downloadPDF(url, filePath);
		if (getFilesizeInMegaBytes(filePath) > 8) {
			throw Error('SizeLimit');
		}
		return article;
	} catch (error) {
		console.log(error);
		if (error instanceof Error && error.message == 'SizeLimit') {
			return 1;
		}
		return 0;
	}
}
