const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

export default {
    cleanOldSegments(outputDir) {
        const files = fs.readdirSync(outputDir);
        if (files.length > 12) {
            const sortedFiles = files
                .map(file => ({ file, timestamp: fs.statSync(path.join(outputDir, file)).ctimeMs }))
                .sort((a, b) => b.timestamp - a.timestamp);

            const filesToRemove = sortedFiles.slice(12);
            filesToRemove.forEach(file => {
                fs.unlinkSync(path.join(outputDir, file.file));
                // console.log(`Segmento removido: ${file.file}`);
            });
        }
    },

    recordSegmentsContinuously({rtsp, outputDir, segmentDuration}) {
        // Cria o diretório se não existir
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        this.recordSegment(rtsp, outputDir, segmentDuration, (err) => {
            if (err) {
                console.error(`Erro ao gravar segmento: ${err.message}`);
            }
            // Continua gravando após o término do segmento
            this.recordSegmentsContinuously({rtsp, outputDir, segmentDuration});
        });
    },

    recordSegment(rtsp, outputDir, duration, callback) {
        const segmentPath = path.join(outputDir, `segment_${Date.now()}.mp4`);
        // Arquivo de log para registrar as alterações
        const logFile = path.join(path.dirname(outputDir), 'changes.log');

        ffmpeg(rtsp)
            .duration(duration)
            .output(segmentPath)
            .on('end', () => {
                // console.log(`Segmento gravado: ${segmentPath}`);

                // Lê o conteúdo do log
                let logContent = '';
                if (fs.existsSync(logFile)) {
                    logContent = fs.readFileSync(logFile, 'utf-8');
                }

                // Divide o log em linhas
                const logLines = logContent.split('\n').filter(line => line.trim() !== '');

                // Adiciona a nova linha no final
                logLines.push(`#${new Date().toISOString()}`)
                logLines.push(`file '${segmentPath}'`);

                // Mantém apenas os últimos 3 segmentos
                const last5Lines = logLines.slice(-6);
                fs.writeFileSync(logFile, last5Lines.join('\n') + '\n');

                callback();
            })
            .on('error', (err) => {
                console.error(`Erro ao gravar segmento: ${err.message}`);
                callback(err);
            })
            .run();
    }
}