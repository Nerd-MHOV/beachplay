const fs = require('fs');
const path = require('path');

// Configurações básicas
const ZM_BASE_URL = 'http://192.168.10.5/zm/api'; // Substitua pelo IP ou domínio do seu ZoneMinder

// Função para baixar o vídeo em MP4
async function downloadRecordingSegment(cameraId, startTime, endTime) {
    try {
        // URL para buscar eventos (gravações)
        const url = `${ZM_BASE_URL}/events/index/MonitorId:${cameraId}.json?StartTime>=${startTime}&EndTime<=${endTime}`;
        
        // Fazer a requisição à API do ZoneMinder para obter os eventos
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar gravações: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.events && data.events.length > 0) {
            console.log(`Foram encontrados ${data.events.length} eventos.`);

            // Vamos pegar o primeiro evento encontrado
            const event = data.events[0];
            const videoUrl = `${ZM_BASE_URL}/events/file/${event.Event.Id}/${event.Event.DefaultVideo}.mp4`;
            const videoPath = path.resolve(__dirname, `video_${event.Event.Id}.mp4`);

            // Fazendo o download do vídeo
            const videoResponse = await fetch(videoUrl, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${ZM_USERNAME}:${ZM_PASSWORD}`).toString('base64')
                }
            });

            if (!videoResponse.ok) {
                throw new Error(`Erro ao baixar o vídeo: ${videoResponse.statusText}`);
            }

            // Salvando o vídeo no sistema de arquivos
            const fileStream = fs.createWriteStream(videoPath);
            await new Promise((resolve, reject) => {
                videoResponse.body.pipe(fileStream);
                videoResponse.body.on('error', reject);
                fileStream.on('finish', resolve);
            });

            console.log(`Vídeo baixado com sucesso: ${videoPath}`);
            return videoPath;

        } else {
            console.log('Nenhuma gravação encontrada para o intervalo de tempo fornecido.');
            return null;
        }
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Parâmetros da busca
const cameraId = 1; // Substitua pelo ID da sua câmera
const startTime = '2024-08-12 17:20:00'; // Exemplo de início
const endTime = '2024-08-12 17:25:00'; // Exemplo de fim

// Chama a função para baixar o vídeo
downloadRecordingSegment(cameraId, startTime, endTime).then(videoPath => {
    if (videoPath) {
        console.log(`O vídeo foi salvo em: ${videoPath}`);
    }
});
