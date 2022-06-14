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
    console.log("Writing downloaded PDF file to " + outputFilename + "...");

    // Create Folder if it does not exist
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputFilename, pdfBuffer);
}

async function getArticle(doi) {
    try{
        const html = await request(`https://sci-hub.hkvisa.net/${doi}`)
        const $ = cheerio.load(html);
        const url =
            "https:" +
            $("#article embed")
                .attr("src")
                .replace("#navpanes=0&view=FitH", "");
        console.log(url);
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
