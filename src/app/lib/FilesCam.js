import fs from "fs";
import ffmpeg from "fluent-ffmpeg"
import {v2 as cloudinary} from "cloudinary";
import CG from "../lib/ChatGuru"

const watermark = __dirname + "/../../public/beach-logo.png"

export default {
    async addWaterMark(path, isProceed = true) {
        let success = false
        path = path + ".mp4"
        //
        let dir = path;
        const filename = dir.split("/").pop();
        dir = dir.substring(0, (dir.length - filename.length - 1));
        const watermarkPath = __dirname+`/../../public/media/watermark/`
        console.log(dir, filename);
        if (!fs.existsSync(watermarkPath+dir.split("/")[0])) {
            fs.mkdirSync(watermarkPath+`/../../public/media/watermark/`+dir.split("/")[0]);
        }
        if (!fs.existsSync(watermarkPath+dir)) {
            fs.mkdirSync(watermarkPath+dir);
        }

        const outputFilePath = __dirname + `/../../public/media/watermark/${dir}/${filename}`;
        const inputFilePath = __dirname + `/../../public/media/no_watermark/${path}`
        if(isProceed) {
            ffmpeg()
                .input(inputFilePath)
                .input(watermark)
                .complexFilter([
                    {
                        filter: 'overlay',
                        options: {
                            x: 'main_w-overlay_w-10', y: 10
                        }
                    }
                ])
                .outputOptions('-t', '30')
                .on('end', () => {
                    console.log(`Marca d'água adicionada aos últimos 10 segundos de: ${inputFilePath}`);
                    // Remova o arquivo original após salvar o novo
                    fs.unlinkSync(inputFilePath);
                    success = true;
                    this.uploadFile(outputFilePath);
                })
                .on('error', (err) => {
                    console.error(`Erro ao adicionar a marca d'água aos últimos 10 segundos de ${inputFilePath}: ${err}`);
                    success = false;
                })
                .save(outputFilePath);

        }else {
            console.log("Not Proceed")
            console.log(`Deleting: ${inputFilePath}`);
            fs.unlinkSync(inputFilePath);
            success = true;
        }

        return success;
    },

    async uploadFile(filepath) {
        try {
            const result = await cloudinary.uploader.upload_large(
                filepath,
                {resource_type: 'video'},
                (error, result) => {
                    if(error) {
                        console.log(error);
                        return
                    }
                    console.log(`> Result: ${result.secure_url}`)
                    const linkToWhats = result.secure_url;
                    console.log(filepath);
                    const clientId = (filepath.split("@"))[1].replace(".mp4", "");
                    console.log(linkToWhats, clientId)
                    CG.sendVideoToClient(linkToWhats, clientId);
                    //sendToClient(linkToWhats, `@${clientId}`)
                }
            )
        } catch (e) {
            console.log(e)
        }
    }
}