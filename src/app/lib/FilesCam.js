import fs from "fs";
import ffmpeg from "fluent-ffmpeg"
import { v2 as cloudinary } from "cloudinary";
import CG from "../lib/ChatGuru"
import path from "path";

const watermark = __dirname + "/../../public/beach-logo.png"

export default {
    async addWaterMark(fileDir) {
        const watermarkPathFile = fileDir.replace('no_watermark', 'watermark');
        const watermarkPath = path.dirname(watermarkPathFile);

        if (!fs.existsSync(watermarkPath)) {
            if(!fs.existsSync(path.dirname(watermarkPath))) fs.mkdirSync(path.dirname(watermarkPath))
            fs.mkdirSync(watermarkPath);
        }
        
        ffmpeg()
            .input(fileDir)
            .input(watermark)
            .complexFilter([
                {
                    filter: 'overlay',
                    options: {
                        x: 'main_w-overlay_w-10', y: 10
                    }
                }
            ])
            .on('end', () => {
                console.log(`Marca d'água adicionada aos últimos 30 segundos`);
                this.uploadFile(watermarkPathFile);
            })
            .on('error', (err) => {
                console.error(`Erro ao adicionar a marca d'água: ${err}`);
            })
            .save(watermarkPathFile);
    },

    async uploadFile(filepath) {
        try {
            console.log(filepath)
            const result = await cloudinary.uploader.upload_large(
                filepath,
                { resource_type: 'video' },
                (error, result) => {
                    if (error) {
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