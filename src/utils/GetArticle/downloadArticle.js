const request = require("request-promise-native");
const cheerio = require("cheerio");
const fs = require("fs");

const dir = "./data/downloads/Articles";

function getFilesizeInMegaBytes(filename) {
    let stats = fs.statSync(filename);
    let fileSizeInBytes = stats.size;
    return fileSizeInBytes / 2**20;
}

async function downloadPDF(pdfURL, outputFilename) {
    let pdfBuffer = await request.get({ uri: pdfURL, encoding: null });

    // Create Folder if it does not exist
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputFilename, pdfBuffer);
}

async function getArticle(doi) {
    try{
        const baseUrl = "https://sci-hub.hkvisa.net"
        const html = await request(`${baseUrl}/${doi}`)
        const $ = cheerio.load(html);
        const srcPdf = $("#article embed")
                .attr("src")
                .replace("#navpanes=0&view=FitH", "");
        let url;
        if (srcPdf[1] !== "/"){
            url = `${baseUrl}${srcPdf}`;
        } else {
            url = `https:${srcPdf}`;
        }
        console.log("[INFO] ",url);
        // URL of the PDF
        const article = url.split("/").at(-1);
        // Path at which PDF will get downloaded
        const filePath = `${dir}/${article}`;
        await downloadPDF(url, filePath);
        if (getFilesizeInMegaBytes(filePath) > 8){
            throw Error("SizeLimit");
        }
        return article;    
    } catch(error){
        if (error.message == "SizeLimit") {
            return 1;
        }
        return 0;
    }
}

module.exports = {
    getArticle,
}
