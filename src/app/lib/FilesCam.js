import fs from "fs";
import ffmpeg from "fluent-ffmpeg"
import {v2 as cloudinary} from "cloudinary";
import CG from "../lib/ChatGuru"

const watermark = __dirname + "/../../public/beach-logo.png"

export default {
    async addWaterMark(path, isProceed = true) {
        let success = false;
        path = path + ".mp4";
    
        let dir = path;
        const filename = dir.split("/").pop();
        dir = dir.substring(0, (dir.length - filename.length - 1));
        const watermarkPath = __dirname + `/../../public/media/watermark/`;
        console.log(dir, filename);
    
        if (!fs.existsSync(watermarkPath + dir.split("/")[0])) {
            fs.mkdirSync(watermarkPath + dir.split("/")[0]);
        }
        if (!fs.existsSync(watermarkPath + dir)) {
            fs.mkdirSync(watermarkPath + dir);
        }
    
        const outputFilePath = __dirname + `/../../public/media/watermark/${dir}/${filename}`;
        const inputFilePath = __dirname + `/../../public/media/no_watermark/${path}`;
    
        if (isProceed) {
            // Primeiro, precisamos obter a duração total do vídeo
            ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
                if (err) {
                    console.error(`Erro ao obter a duração do vídeo: ${err}`);
                    success = false;
                    return;
                }
    
                const videoDuration = metadata.format.duration;
                let startTime = videoDuration - 30; // Inicia 30 segundos antes do fim
                console.log(videoDuration, startTime);
                if (startTime < 0)  startTime = 0;
                
    
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
                    .outputOptions('-ss', startTime)
                    .on('end', () => {
                        console.log(`Marca d'água adicionada aos últimos 30 segundos de: ${inputFilePath}`);
                        success = true;
                        this.uploadFile(outputFilePath);
                    })
                    .on('error', (err) => {
                        console.error(`Erro ao adicionar a marca d'água: ${err}`);
                        success = false;
                    })
                    .save(outputFilePath);
            });
        } else {
            console.log("Not Proceed");
            console.log(`Deleting: ${inputFilePath}`);
            fs.unlinkSync(inputFilePath);
            success = true;
        }
    
        return success;
    },

    async uploadFile(filepath) {
        try {
            console.log(filepath)
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