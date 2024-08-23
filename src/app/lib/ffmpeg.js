import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export default {
    saveOutputVideo(logFile, outputFile) {
        return new Promise((resolve, reject) => {
            const outputDir = path.dirname(outputFile);
            if (!fs.existsSync(outputDir)) {
                if(!fs.existsSync(path.dirname(outputDir))) fs.mkdirSync(path.dirname(outputDir)); // cam;
                fs.mkdirSync(outputDir); // data;
            }
            const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${logFile} -c copy ${outputFile} -y`;

            // Executa o comando ffmpeg para criar o arquivo de saída
            exec(ffmpegCommand, (error) => {
                if (error) {
                    console.error(`Erro ao criar o arquivo output.mp4: ${error.message}`);
                    reject(`Erro ao criar o arquivo output.mp4`);
                } else {
                    console.log(`Arquivo output.mp4 criado com sucesso!`);
                    resolve(outputFile);
                }
            });
        });
    }
}
