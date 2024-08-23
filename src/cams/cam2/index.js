const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Diretório onde os segmentos serão salvos
const outputDir = path.join(__dirname, 'segments');
const cam = `rtsp://admin:123456@192.168.25.52:554/cam/realmonitor?channel=2&subtype=1`;

// Cria o diretório se não existir
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Arquivo de log para registrar as alterações
const logFile = path.join(__dirname, 'changes.log');

function recordSegment(duration, callback) {
    const segmentPath = path.join(outputDir, `segment_${Date.now()}.mp4`);
    ffmpeg(cam)
        .duration(duration)
        .output(segmentPath)
        .on('end', () => {
            // console.log(`Segmento gravado: ${segmentPath}`);

            // GPT
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

            // Mantém apenas as últimas 5 linhas
            const last5Lines = logLines.slice(-6);

            // Escreve as últimas 5 linhas de volta no arquivo
            fs.writeFileSync(logFile, last5Lines.join('\n') + '\n');

            //GPT


            // Registra a alteração no arquivo de log
            // fs.appendFileSync(logFile, `${new Date().toISOString()} - ${segmentPath}\n`);
            callback();
        })
        .on('error', (err) => {
            console.error(`Erro ao gravar segmento: ${err.message}`);
            callback(err);
        })
        .run();
}

function recordSegmentsContinuously(segmentDuration) {
    recordSegment(segmentDuration, (err) => {
        if (err) {
            console.error(`Erro ao gravar segmento: ${err.message}`);
        }
        // Continua gravando após o término do segmento
        recordSegmentsContinuously(segmentDuration);
    });
}

// Inicia a gravação contínua
recordSegmentsContinuously(10); // Grava segmentos de 10 segundos

// Limpa segmentos antigos (mantém os últimos 12)
function cleanOldSegments() {
    const files = fs.readdirSync(outputDir);
    if (files.length > 12) {
        const sortedFiles = files
            .map(file => ({ file, timestamp: fs.statSync(path.join(outputDir, file)).ctimeMs }))
            .sort((a, b) => b.timestamp - a.timestamp);

        const filesToRemove = sortedFiles.slice(12);
        filesToRemove.forEach(file => {
            fs.unlinkSync(path.join(outputDir, file.file));
            console.log(`Segmento removido: ${file.file}`);
        });
    }
}

// Executa a limpeza a cada hora (3600000 ms)
setInterval(cleanOldSegments, 30000);
