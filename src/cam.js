import path from 'path'
import segmentsCam from './app/lib/segmentsCam';

const segmentDuration = 10;
const cams = [
    {
        rtsp: 'rtsp://admin:123456@192.168.25.51:554/cam/realmonitor?channel=1&subtype=1',
        outputDir: path.join(__dirname, 'cams', 'cam1', 'segments'),
        segmentDuration,
    },
    {
        rtsp: 'rtsp://admin:123456@192.168.25.52:554/cam/realmonitor?channel=2&subtype=1',
        outputDir: path.join(__dirname, 'cams', 'cam2', 'segments'),
        segmentDuration,
    },
]

cams.forEach( cam => {
    // Inicia a gravação contínua
    segmentsCam.recordSegmentsContinuously(cam); // Grava segmentos de 10 segundos
    // Executa a limpeza a cada hora (3600000 ms)
    setInterval(() => {segmentsCam.cleanOldSegments(cam.outputDir)}, 30000);
})
